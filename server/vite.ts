import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { type Server } from "http";
import { nanoid } from "nanoid";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const { createServer: createViteServer, createLogger } = await import("vite");
  const viteConfig = (await import("../vite.config.js")).default;
  const viteLogger = createLogger();

  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const pathname = new URL(url, 'http://localhost').pathname;
      const entry = pathname === '/'
        ? 'index.html'
        : pathname === '/projects'
          ? 'projects.html'
          : pathname.startsWith('/admin')
            ? 'admin.html'
            : '404.html';
      const status = entry === '404.html' ? 404 : 200;
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        entry,
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      if (entry === 'admin.html' || entry === '404.html') {
        res.set('X-Robots-Tag', 'noindex, nofollow');
      }
      res.status(status).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    log(`Could not find the build directory: ${distPath}, assuming static files are served by Vercel CDN.`);
    return;
  }

  app.use(express.static(distPath));

  app.get('/projects', (_req, res) => {
    res.sendFile(path.resolve(distPath, 'projects.html'));
  });
  app.get(['/admin', '/admin/dashboard'], (_req, res) => {
    res.set('X-Robots-Tag', 'noindex, nofollow');
    res.sendFile(path.resolve(distPath, 'admin.html'));
  });
  app.get('/', (_req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
  app.use("*", (_req, res) => {
    res.set('X-Robots-Tag', 'noindex, nofollow');
    res.status(404).sendFile(path.resolve(distPath, '404.html'));
  });
}
