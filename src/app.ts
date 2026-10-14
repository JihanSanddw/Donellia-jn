import express, { type Express, type Request, type Response } from 'express';
import connection from './config/database';

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.status(200).json ({
    success: true,
    message: 'Theres Denollia API!'
  })
});

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