import type { Express } from 'express';
import { createServer, type Server } from 'http';
import multer from 'multer';
import { storage } from './storage.js';
import { generateToken, setAuthCookie, clearAuthCookie, requireAuth } from './auth.js';
import { uploadToImageKit, deleteFromImageKit } from './imagekit.js';
import { sendContactEmail } from './resend.js';
import { insertContactSchema } from '../shared/schema.js';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { randomUUID } from 'crypto';
import { analyticsBatchSchema, auditActions, type AuditAction, type AuditOutcome } from '../shared/schema.js';
import { adminActor, changedFields, csvCell, getCountry, isBot, normalizePath, normalizeReferrer, parseDevice, writeAudit } from './telemetry.js';

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

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many messages. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const analyticsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  message: { success: false, message: 'Analytics rate limit exceeded' },
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

// ─── Routes ───────────────────────────────────────────────────────────────────

export async function registerRoutes(app: Express): Promise<Server> {

  // Public, privacy-safe analytics ingestion.
  app.post('/api/analytics/events', analyticsLimiter, async (req, res) => {
    try {
      if (isBot(req.get('user-agent') || '')) {
        res.status(202).json({ success: true, accepted: 0 });
        return;
      }
      const { events } = analyticsBatchSchema.parse(req.body);
      const device = parseDevice(req.get('user-agent') || '');
      const country = getCountry(req);
      const createdAt = new Date();
      const normalized = events.flatMap(event => {
        const path = normalizePath(event.path);
        if (!path) return [];
        return [{
          ...event,
          path,
          referrer: normalizeReferrer(event.referrer),
          device,
          country,
          createdAt,
        }];
      });
      await storage.createAnalyticsEvents(normalized);
      res.status(202).json({ success: true, accepted: normalized.length });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ success: false, message: 'Invalid analytics event', errors: err.errors });
      } else {
        console.error('[POST /api/analytics/events]', err);
        res.status(500).json({ success: false, message: 'Failed to record analytics' });
      }
    }
  });

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
  app.post('/api/contacts', contactLimiter, async (req, res) => {
    try {
      const data = insertContactSchema.parse(req.body);
      await sendContactEmail(data);

      try {
        await storage.createContact(data);
      } catch (storageError) {
        console.error('[POST /api/contacts] Message sent, but database save failed:', storageError);
      }

      const suppliedSession = String(req.get('x-analytics-session') || '');
      const sessionId = /^[a-zA-Z0-9_-]{16,80}$/.test(suppliedSession) ? suppliedSession : randomUUID();
      await storage.createAnalyticsEvents([{
        type: 'contact_submit',
        sessionId,
        path: '/',
        referrer: normalizeReferrer(req.get('referer')),
        device: parseDevice(req.get('user-agent') || ''),
        country: getCountry(req),
        createdAt: new Date(),
      }]).catch(error => console.error('[Analytics] Contact conversion was not recorded', error));

      res.json({ success: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ success: false, message: 'Validation error', errors: err.errors });
      } else {
        console.error('[POST /api/contacts]', err);
        res.status(502).json({ success: false, message: 'Your message could not be sent. Please try again.' });
      }
    }
  });

  // ── Admin: login ──────────────────────────────────────────────────────────
  app.post('/api/admin/login', loginLimiter, async (req, res) => {
    const { username, password } = req.body;
    const validUser = process.env.ADMIN_USERNAME;
    const validPass = process.env.ADMIN_PASSWORD;

    if (!validUser || !validPass) {
      await writeAudit(req, { actor: String(username || 'unknown').slice(0, 100), action: 'auth.login_failed', outcome: 'failure', targetType: 'session', changedFields: [], message: 'Admin credentials not configured' });
      res.status(500).json({ success: false, message: 'Admin credentials not configured' });
      return;
    }

    if (username !== validUser || password !== validPass) {
      await writeAudit(req, { actor: String(username || 'unknown').slice(0, 100), action: 'auth.login_failed', outcome: 'failure', targetType: 'session', changedFields: [], message: 'Invalid credentials' });
      res.status(401).json({ success: false, message: 'Invalid username or password' });
      return;
    }

    const token = generateToken(username);
    setAuthCookie(res, token);
    await writeAudit(req, { actor: username, action: 'auth.login', outcome: 'success', targetType: 'session', changedFields: [] });
    res.json({ success: true });
  });

  // ── Admin: logout ─────────────────────────────────────────────────────────
  app.post('/api/admin/logout', requireAuth, async (req, res) => {
    clearAuthCookie(res);
    await writeAudit(req, { actor: adminActor(req), action: 'auth.logout', outcome: 'success', targetType: 'session', changedFields: [] });
    res.json({ success: true });
  });

  // ── Admin: check auth status ──────────────────────────────────────────────
  app.get('/api/admin/me', requireAuth, (req, res) => {
    res.json({ success: true, authenticated: true, username: adminActor(req, 'admin') });
  });

  app.get('/api/admin/analytics', requireAuth, async (req, res) => {
    try {
      const range = Number(req.query.range || 30);
      if (![7, 30, 90].includes(range)) {
        res.status(400).json({ success: false, message: 'Range must be 7, 30, or 90 days' });
        return;
      }
      const timezone = String(req.query.timezone || 'UTC');
      try { new Intl.DateTimeFormat('en-US', { timeZone: timezone }).format(); } catch {
        res.status(400).json({ success: false, message: 'Invalid timezone' });
        return;
      }
      res.json(await storage.getAnalyticsSummary(range as 7 | 30 | 90, timezone));
    } catch (err) {
      console.error('[GET /api/admin/analytics]', err);
      res.status(500).json({ success: false, message: 'Failed to load analytics' });
    }
  });

  app.get('/api/admin/audit-logs', requireAuth, async (req, res) => {
    try {
      res.json(await storage.getAuditLogs(parseAuditFilters(req.query)));
    } catch (err) {
      console.error('[GET /api/admin/audit-logs]', err);
      res.status(400).json({ success: false, message: err instanceof Error ? err.message : 'Invalid audit filters' });
    }
  });

  app.get('/api/admin/audit-logs/export', requireAuth, async (req, res) => {
    try {
      const { page: _page, limit: _limit, ...filters } = parseAuditFilters(req.query);
      const rows = await storage.exportAuditLogs(filters);
      await writeAudit(req, { actor: adminActor(req), action: 'audit.export', outcome: 'success', targetType: 'audit_logs', changedFields: [] });
      const header = ['Timestamp', 'Actor', 'Action', 'Outcome', 'Target type', 'Target ID', 'Target label', 'Changed fields', 'IP hash', 'Device', 'Message'];
      const csv = [header.map(csvCell).join(','), ...rows.map((row: any) => [row.createdAt.toISOString(), row.actor, row.action, row.outcome, row.targetType, row.targetId, row.targetLabel, row.changedFields, row.ipHash, row.device, row.message].map(csvCell).join(','))].join('\r\n');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="audit-log-${new Date().toISOString().slice(0, 10)}.csv"`);
      res.send(`\uFEFF${csv}`);
    } catch (err) {
      await writeAudit(req, { actor: adminActor(req), action: 'audit.export', outcome: 'failure', targetType: 'audit_logs', changedFields: [], message: 'Export failed' });
      res.status(400).json({ success: false, message: err instanceof Error ? err.message : 'Audit export failed' });
    }
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
      await writeAudit(req, { actor: adminActor(req), action: 'project.create', outcome: 'success', targetType: 'project', targetId: String(project._id), targetLabel: project.title, changedFields: changedFields(req.body) });
      res.status(201).json({ success: true, project });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ success: false, message: 'Validation error', errors: err.errors });
      } else {
        console.error('[POST /api/admin/projects]', err);
        await writeAudit(req, { actor: adminActor(req), action: 'project.create', outcome: 'failure', targetType: 'project', targetLabel: String(req.body?.title || '').slice(0, 120), changedFields: changedFields(req.body || {}), message: 'Create failed' });
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
      await writeAudit(req, { actor: adminActor(req), action: 'project.update', outcome: 'success', targetType: 'project', targetId: id, targetLabel: project.title, changedFields: changedFields(req.body) });
      res.json({ success: true, project });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ success: false, message: 'Validation error', errors: err.errors });
      } else {
        console.error('[PUT /api/admin/projects/:id]', err);
        await writeAudit(req, { actor: adminActor(req), action: 'project.update', outcome: 'failure', targetType: 'project', targetId: req.params.id, changedFields: changedFields(req.body || {}), message: 'Update failed' });
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

        await writeAudit(req, { actor: adminActor(req), action: 'project.image_replace', outcome: 'success', targetType: 'project', targetId: id, targetLabel: existing.title, changedFields: ['image'] });

        res.json({ success: true, imageUrl: url, fileId, project: updated });
      } catch (err: any) {
        console.error('[POST /api/admin/projects/:id/image]', err);
        await writeAudit(req, { actor: adminActor(req), action: 'project.image_replace', outcome: 'failure', targetType: 'project', targetId: req.params.id, changedFields: ['image'], message: 'Image replacement failed' });
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
      await writeAudit(req, { actor: adminActor(req), action: 'project.delete', outcome: 'success', targetType: 'project', targetId: id, targetLabel: existing.title, changedFields: [] });
      res.json({ success: true });
    } catch (err) {
      console.error('[DELETE /api/admin/projects/:id]', err);
      await writeAudit(req, { actor: adminActor(req), action: 'project.delete', outcome: 'failure', targetType: 'project', targetId: req.params.id, changedFields: [], message: 'Delete failed' });
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
      await writeAudit(req, { actor: adminActor(req), action: 'project.reorder', outcome: 'success', targetType: 'project_collection', changedFields: ['order'] });
      res.json({ success: true });
    } catch (err) {
      console.error('[POST /api/admin/projects/reorder]', err);
      await writeAudit(req, { actor: adminActor(req), action: 'project.reorder', outcome: 'failure', targetType: 'project_collection', changedFields: ['order'], message: 'Reorder failed' });
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

function parseAuditFilters(query: Record<string, any>) {
  const page = Math.max(1, Number(query.page || 1));
  const limit = Math.min(100, Math.max(1, Number(query.limit || 25)));
  if (!Number.isInteger(page) || !Number.isInteger(limit)) throw new Error('Invalid pagination');
  const action = query.action ? String(query.action) as AuditAction : undefined;
  if (action && !auditActions.includes(action)) throw new Error('Invalid audit action');
  const outcome = query.outcome ? String(query.outcome) as AuditOutcome : undefined;
  if (outcome && !['success', 'failure'].includes(outcome)) throw new Error('Invalid outcome');
  const search = query.search ? String(query.search).trim().slice(0, 120) : undefined;
  const from = query.from ? new Date(String(query.from)) : undefined;
  const to = query.to ? new Date(String(query.to)) : undefined;
  if ((from && Number.isNaN(from.getTime())) || (to && Number.isNaN(to.getTime()))) throw new Error('Invalid date filter');
  return { page, limit, action, outcome, search, from, to };
}
