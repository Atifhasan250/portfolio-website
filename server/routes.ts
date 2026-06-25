import type { Express } from 'express';
import { createServer, type Server } from 'http';
import multer from 'multer';
import { storage } from './storage.js';
import { generateToken, setAuthCookie, clearAuthCookie, requireAuth } from './auth.js';
import { uploadToImageKit, deleteFromImageKit } from './imagekit.js';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';

// Multer — memory storage (we forward the buffer to ImageKit)
// 10 MB limit; accepts images and GIFs
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (including GIFs) are allowed'));
    }
  },
});

// Brute force protection for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per windowMs
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Zod schemas ───────────────────────────────────────────────────────────────

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  link: z.string().url('Must be a valid URL'),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  featured: z.boolean().optional(),
  order: z.number().optional(),
});

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

// ─── Routes ───────────────────────────────────────────────────────────────────

export async function registerRoutes(app: Express): Promise<Server> {

  // ── Public: get all projects ──────────────────────────────────────────────
  app.get('/api/projects', async (_req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (err) {
      console.error('[GET /api/projects]', err);
      res.status(500).json({ success: false, message: 'Failed to fetch projects' });
    }
  });

  // ── Public: contact form ──────────────────────────────────────────────────
  app.post('/api/contacts', async (req, res) => {
    try {
      const data = contactSchema.parse(req.body);
      const contact = await storage.createContact(data);
      res.json({ success: true, contact });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ success: false, message: 'Validation error', errors: err.errors });
      } else {
        res.status(500).json({ success: false, message: 'Failed to save contact message' });
      }
    }
  });

  // ── Admin: login ──────────────────────────────────────────────────────────
  app.post('/api/admin/login', loginLimiter, (req, res) => {
    const { username, password } = req.body;
    const validUser = process.env.ADMIN_USERNAME;
    const validPass = process.env.ADMIN_PASSWORD;

    if (!validUser || !validPass) {
      res.status(500).json({ success: false, message: 'Admin credentials not configured' });
      return;
    }

    if (username !== validUser || password !== validPass) {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
      return;
    }

    const token = generateToken(username);
    setAuthCookie(res, token);
    res.json({ success: true });
  });

  // ── Admin: logout ─────────────────────────────────────────────────────────
  app.post('/api/admin/logout', (_req, res) => {
    clearAuthCookie(res);
    res.json({ success: true });
  });

  // ── Admin: check auth status ──────────────────────────────────────────────
  app.get('/api/admin/me', requireAuth, (_req, res) => {
    res.json({ success: true, authenticated: true });
  });

  // ── Admin: get all projects ───────────────────────────────────────────────
  app.get('/api/admin/projects', requireAuth, async (_req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (err) {
      console.error('[GET /api/admin/projects]', err);
      res.status(500).json({ success: false, message: 'Failed to fetch projects' });
    }
  });

  // ── Admin: create project ─────────────────────────────────────────────────
  app.post('/api/admin/projects', requireAuth, async (req, res) => {
    try {
      const data = projectSchema.parse(req.body);
      const project = await storage.createProject(data);
      res.status(201).json({ success: true, project });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ success: false, message: 'Validation error', errors: err.errors });
      } else {
        console.error('[POST /api/admin/projects]', err);
        res.status(500).json({ success: false, message: 'Failed to create project' });
      }
    }
  });

  // ── Admin: update project ─────────────────────────────────────────────────
  app.put('/api/admin/projects/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const data = projectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, data);
      if (!project) {
        res.status(404).json({ success: false, message: 'Project not found' });
        return;
      }
      res.json({ success: true, project });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ success: false, message: 'Validation error', errors: err.errors });
      } else {
        console.error('[PUT /api/admin/projects/:id]', err);
        res.status(500).json({ success: false, message: 'Failed to update project' });
      }
    }
  });

  // ── Admin: upload / replace project image ─────────────────────────────────
  app.post(
    '/api/admin/projects/:id/image',
    requireAuth,
    upload.single('image'),
    async (req, res) => {
      try {
        const { id } = req.params;
        if (!req.file) {
          res.status(400).json({ success: false, message: 'No image file provided' });
          return;
        }

        // Fetch existing project to get old fileId
        const existing = await storage.getProject(id);
        if (!existing) {
          res.status(404).json({ success: false, message: 'Project not found' });
          return;
        }

        // Delete old image from ImageKit if it exists
        if (existing.imagekitFileId) {
          await deleteFromImageKit(existing.imagekitFileId);
        }

        // Upload new image to ImageKit
        const { url, fileId } = await uploadToImageKit(
          req.file.buffer,
          req.file.originalname,
        );

        // Persist new image URL + fileId on the project
        const updated = await storage.updateProject(id, {
          imageUrl: url,
          imagekitFileId: fileId,
        });

        res.json({ success: true, imageUrl: url, fileId, project: updated });
      } catch (err: any) {
        console.error('[POST /api/admin/projects/:id/image]', err);
        res.status(500).json({ success: false, message: err.message || 'Failed to upload image' });
      }
    }
  );

  // ── Admin: delete project ─────────────────────────────────────────────────
  app.delete('/api/admin/projects/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;

      // Fetch to get imagekit fileId before deleting
      const existing = await storage.getProject(id);
      if (!existing) {
        res.status(404).json({ success: false, message: 'Project not found' });
        return;
      }

      // Delete image from ImageKit
      if (existing.imagekitFileId) {
        await deleteFromImageKit(existing.imagekitFileId);
      }

      await storage.deleteProject(id);
      res.json({ success: true });
    } catch (err) {
      console.error('[DELETE /api/admin/projects/:id]', err);
      res.status(500).json({ success: false, message: 'Failed to delete project' });
    }
  });

  // ── Admin: reorder projects ───────────────────────────────────────────────
  app.post('/api/admin/projects/reorder', requireAuth, async (req, res) => {
    try {
      const { orderedIds } = req.body as { orderedIds: string[] };
      if (!Array.isArray(orderedIds)) {
        res.status(400).json({ success: false, message: 'orderedIds must be an array' });
        return;
      }
      await storage.reorderProjects(orderedIds);
      res.json({ success: true });
    } catch (err) {
      console.error('[POST /api/admin/projects/reorder]', err);
      res.status(500).json({ success: false, message: 'Failed to reorder projects' });
    }
  });

  // ── Admin: get contacts ───────────────────────────────────────────────────
  app.get('/api/admin/contacts', requireAuth, async (_req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to retrieve contacts' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
