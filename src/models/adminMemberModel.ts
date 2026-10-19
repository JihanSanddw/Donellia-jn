import connection from "../config/database";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

export interface MemberRow extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  role: "user" | "admin";
  avatar_url: string | null;
  is_active: number | boolean;
  created_at: Date;
  updated_at: Date;
}

export async function getAllMembers(): Promise<MemberRow[]> {
  const [rows] = await (await connection).query<MemberRow[]>(
    `SELECT id, username, email, role, avatar_url,
            is_active, created_at, updated_at
     FROM users
     WHERE role = 'user'
     ORDER BY created_at DESC`
  );

  return rows;
}

export async function getMemberById(
  id: number
): Promise<MemberRow | null> {
  const [rows] = await (await connection).query<MemberRow[]>(
    `SELECT id, username, email, role, avatar_url,
            is_active, created_at, updated_at
     FROM users
     WHERE id = ? AND role = 'user'
     LIMIT 1`,
    [id]
  );

  return rows[0] ?? null;
}

export async function updateMemberStatus(
  id: number,
  isActive: boolean
): Promise<boolean> {
  const [result] = await (await connection).query<ResultSetHeader>(
    `UPDATE users
     SET is_active = ?
     WHERE id = ? AND role = 'user'`,
    [isActive ? 1 : 0, id]
  );

  return result.affectedRows > 0;
}
