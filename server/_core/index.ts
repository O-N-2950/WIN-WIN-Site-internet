import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import session from "express-session";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import passport from "./auth-standard";
import authRoutes from "./auth-routes";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  
  // Redirect winwin.swiss to www.winwin.swiss
  app.use((req, res, next) => {
    const host = req.get('host');
    if (host === 'winwin.swiss') {
      return res.redirect(301, `https://www.winwin.swiss${req.url}`);
    }
    next();
  });
  
  // Stripe webhook needs raw body for signature verification
  app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const { handleStripeWebhook } = await import('../webhooks/stripe');
    return handleStripeWebhook(req, res);
  });
  
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  // Session configuration for OAuth
  app.use(
    session({
      secret: process.env.JWT_SECRET || 'fallback-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );
  
  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  // OAuth routes (only if OAuth is configured)
  if (process.env.OAUTH_SERVER_URL) {
    app.use('/api', authRoutes);
    // OAuth callback under /api/oauth/callback
    registerOAuthRoutes(app);
    console.log('[OAuth] Routes registered');
  } else {
    console.warn('[OAuth] Routes disabled (OAUTH_SERVER_URL not configured)');
  }
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // In production (Passenger), use the provided PORT directly without fallback
  // In development, find an available port if the preferred one is busy
  let port: number;
  
  if (process.env.NODE_ENV === "production") {
    // Production: use PORT directly (Passenger manages port allocation)
    port = parseInt(process.env.PORT || "3000");
  } else {
    // Development: find available port with fallback
    const preferredPort = parseInt(process.env.PORT || "3000");
    port = await findAvailablePort(preferredPort);
    if (port !== preferredPort) {
      console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
    }
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
