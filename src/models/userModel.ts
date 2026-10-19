
import connection from "../config/database";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

export interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: "user" | "admin";
  avatar_url: string | null;
  is_active: number | boolean;
  created_at: Date;
}

export interface PublicUser {
  id: number;
  username: string;
  email: string;
  role: "user" | "admin";
  avatar_url: string | null;
  created_at: Date;
}

export async function findUserByEmail(
  email: string
): Promise<UserRow | null> {
  const [rows] = await (await connection).query<UserRow[]>(
    `SELECT id, username, email, password_hash,
            role, avatar_url, is_active, created_at
     FROM users
     WHERE email = ?
     LIMIT 1`,
    [email]
  );

  return rows[0] ?? null;
}

export async function createUser(data: {
  username: string;
  email: string;
  passwordHash: string;
  avatarUrl: string;
}): Promise<number> {
  const [result] = await (await connection).query<ResultSetHeader>(
    `INSERT INTO users
      (username, email, password_hash, avatar_url)
     VALUES (?, ?, ?, ?)`,
    [
      data.username,
      data.email,
      data.passwordHash,
      data.avatarUrl,
    ]
  );

  return result.insertId;
}

export async function findUserById(
  id: number
): Promise<UserRow | null> {
  const [rows] = await (await connection).query<UserRow[]>(
    `SELECT id, username, email, password_hash,
            role, avatar_url, is_active, created_at
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] ?? null;
}

export function toPublicUser(user: UserRow): PublicUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    avatar_url: user.avatar_url,
    created_at: user.created_at,
  };
}
