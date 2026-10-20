import express, { type Express, type Request, type Response } from 'express';
import connection from "./config/database";
import authRoutes from "./routes/authRoutes";
import wishlistRoutes from "./routes/wishlistRoutes";
import giftRoutes from "./routes/giftRoutes";
import adminRoutes from "./routes/adminRoutes";

const app: Express = express();

// Middleware harus sebelum routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Denollia API is running!",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/wishlists", wishlistRoutes);
app.use("/api/gifts", giftRoutes);
app.use("/api/admin", adminRoutes);

// Endpoint database tetap dipertahankan di bawah ini.
app.get("/api/health/db", async (req, res) => {
  try {
    const [rows] = await (await connection).query(
      "SELECT 1 AS connected"
    );

    res.status(200).json({
      success: true,
      message: "Database connection successful",
      data: rows,
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

export default app;
