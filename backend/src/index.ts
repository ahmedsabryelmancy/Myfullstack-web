import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import cartRoutes from "./routes/cart";
import wishlistRoutes from "./routes/wishlist";
import orderRoutes from "./routes/orders";

const app = express();

// ── CORS ──────────────────────────────────────────────────
// Must be first so OPTIONS preflight is answered before any other middleware runs.
const rawOrigins = process.env.ALLOWED_ORIGINS ?? "http://localhost:5173";
const allowedOrigins = rawOrigins.split(",").map((o) => o.trim()).filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server (no origin header) and explicitly listed origins.
      // Use callback(null, false) — not new Error() — so the browser gets a proper
      // CORS rejection instead of an unhandled Express error.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ── Body parsing ──────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));

// ── DB middleware ─────────────────────────────────────────
// Called on every request so serverless cold starts always get a live connection.
// connectDB() is a no-op when the socket is already open (cached promise).
app.use(async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await connectDB();
    next();
  } catch {
    res.status(503).json({ success: false, message: "Database temporarily unavailable." });
  }
});

// ── Health check ─────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Routes ────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);

// ── 404 ───────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// ── Local dev server ──────────────────────────────────────
// Vercel sets VERCEL=1 at runtime, so this block is skipped in production.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT ?? 5000;
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running → http://localhost:${PORT}`);
      });
    })
    .catch((err: unknown) => {
      console.error("Startup failed:", err);
      process.exit(1);
    });
}

// Default export is what Vercel calls as the serverless handler
export default app;
