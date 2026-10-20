import connection from "../config/database";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

export interface WishlistItem extends RowDataPacket {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  category: "todo" | "wishlist" | "goal";
  priority: "low" | "medium" | "high";
  status: "planned" | "in_progress" | "completed";
  target_date: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface WishlistInput {
  title: string;
  description: string | null;
  category: "todo" | "wishlist" | "goal";
  priority: "low" | "medium" | "high";
  status: "planned" | "in_progress" | "completed";
  target_date: string | null;
}

export async function getAllItems(userId: number) {
  const [rows] = await (await connection).query<WishlistItem[]>(
    `SELECT id, user_id, title, description, category,
            priority, status, target_date, created_at, updated_at
     FROM wishlists
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId]
  );

  return rows;
}

export async function getItemById(id: number, userId: number) {
  const [rows] = await (await connection).query<WishlistItem[]>(
    `SELECT id, user_id, title, description, category,
            priority, status, target_date, created_at, updated_at
     FROM wishlists
     WHERE id = ? AND user_id = ?
     LIMIT 1`,
    [id, userId]
  );

  return rows[0] ?? null;
}

export async function createItem(userId: number, data: WishlistInput) {
  const [result] = await (await connection).query<ResultSetHeader>(
    `INSERT INTO wishlists
      (user_id, title, description, category, priority, status, target_date)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      data.title,
      data.description,
      data.category,
      data.priority,
      data.status,
      data.target_date,
    ]
  );

  return result.insertId;
}

export async function updateItem(
  id: number,
  userId: number,
  data: WishlistInput
) {
  const [result] = await (await connection).query<ResultSetHeader>(
    `UPDATE wishlists
     SET title = ?, description = ?, category = ?,
         priority = ?, status = ?, target_date = ?
     WHERE id = ? AND user_id = ?`,
    [
      data.title,
      data.description,
      data.category,
      data.priority,
      data.status,
      data.target_date,
      id,
      userId,
    ]
  );

  return result.affectedRows;
}

export async function deleteItem(id: number, userId: number) {
  const [result] = await (await connection).query<ResultSetHeader>(
    `DELETE FROM wishlists
     WHERE id = ? AND user_id = ?`,
    [id, userId]
  );

  return result.affectedRows;
}
