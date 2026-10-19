import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";

import { uploadImage } from "../utils/cloudinaryUtil";
import connection from "../config/database";

// REGISTER
export async function register(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;

    // Periksa input
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Semua data wajib diisi",
      });
    }

    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({
        message: "Password harus 8-72 karakter",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Foto profil wajib diunggah",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();

    if (cleanUsername.length < 2 || cleanUsername.length > 50) {
      return res.status(400).json({
        message: "Username harus 2-50 karakter",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        message: "Format email tidak valid",
      });
    }

    // Periksa apakah email sudah terdaftar
    const [rows] = await (await connection).query<any[]>(
      "SELECT id FROM users WHERE email = ?",
      [cleanEmail]
    );

    if (rows.length > 0) {
      return res.status(409).json({
        message: "Email sudah terdaftar",
      });
    }

    // Upload foto ke Cloudinary
    const image = await uploadImage(req.file.buffer);

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Simpan user ke database
    const [result] = await (await connection).query<any>(
      `INSERT INTO users
       (username, email, password_hash, avatar_url)
       VALUES (?, ?, ?, ?)`,
      [
        cleanUsername,
        cleanEmail,
        passwordHash,
        image.secure_url,
      ]
    );

    return res.status(201).json({
      message: "Registrasi berhasil",
      user: {
        id: result.insertId,
        username: cleanUsername,
        email: cleanEmail,
        avatar_url: image.secure_url,
      },
    });
  } catch (error) {
    console.error(error);

    if ((error as any).code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Email sudah terdaftar",
      });
    }

    return res.status(500).json({
      message: "Registrasi gagal",
    });
  }
}

// LOGIN
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Periksa input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi",
      });
    }

    // Cari user
    const [rows] = await (await connection).query<any[]>(
      "SELECT * FROM users WHERE email = ?",
      [email.trim().toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }

    const user = rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        message: "Akun dinonaktifkan",
      });
    }

    // Cocokkan password
    const passwordValid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordValid) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }

    // Buat JWT
    const secret = process.env.JWT_SECRET;

    if (!secret || secret.length < 32) {
      throw new Error("JWT_SECRET belum benar");
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      secret,
      {
        expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as SignOptions["expiresIn"],
      }
    );

    return res.status(200).json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Login gagal",
    });
  }
}


export async function getProfile(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;

    const [rows] = await (await connection).query<any[]>(
      `SELECT id, username, email, role, avatar_url, created_at
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profil berhasil diambil",
      user: rows[0],
    });
  } catch (error) {
    console.error("Get profile failed:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil profil",
    });
  }
}
