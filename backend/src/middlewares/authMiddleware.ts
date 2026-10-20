import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { findUserById } from "../models/userModel";

export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Token autentikasi diperlukan",
    });
  }

  const token = authorization.slice(7);
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    return res.status(500).json({
      success: false,
      message: "Konfigurasi JWT belum benar",
    });
  }

  let decoded: string | jwt.JwtPayload;

  try {
    decoded = jwt.verify(token, secret);
  } catch {
    return res.status(401).json({
      success: false,
      message: "Token tidak valid atau sudah kedaluwarsa",
    });
  }

  if (
    typeof decoded === "string" ||
    typeof decoded.id !== "number" ||
    !Number.isSafeInteger(decoded.id) ||
    decoded.id <= 0
  ) {
    return res.status(401).json({
      success: false,
      message: "Data token tidak valid",
    });
  }

  try {
    const user = await findUserById(decoded.id);

    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: "Akun tidak ditemukan atau sudah dinonaktifkan",
      });
    }

    // Gunakan role terbaru dari database, bukan hanya role dalam token.
    (req as any).user = {
      id: user.id,
      role: user.role,
    };

    return next();
  } catch (error) {
    console.error("Authentication check failed:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal memverifikasi status akun",
    });
  }
}
