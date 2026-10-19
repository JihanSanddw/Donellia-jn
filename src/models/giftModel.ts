import connection from "../config/database";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

export interface GiftItem extends RowDataPacket {
  id: number;
  user_id: number;
  recipient_name: string;
  gift_name: string;
  occasion: string | null;
  budget: string | number | null;
  event_date: string | null;
  status: "planned" | "purchased" | "given";
  created_at: Date;
  updated_at: Date;
}

export interface GiftInput {
  recipient_name: string;
  gift_name: string;
  occasion: string | null;
  budget: number | null;
  event_date: string | null;
  status: "planned" | "purchased" | "given";
}

export async function getAllGifts(userId: number) {
  const [rows] = await (await connection).query<GiftItem[]>(
    `SELECT id, user_id, recipient_name, gift_name, occasion,
            budget, event_date, status, created_at, updated_at
     FROM gifts
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId]
  );

  return rows;
}

export async function getGiftById(id: number, userId: number) {
  const [rows] = await (await connection).query<GiftItem[]>(
    `SELECT id, user_id, recipient_name, gift_name, occasion,
            budget, event_date, status, created_at, updated_at
     FROM gifts
     WHERE id = ? AND user_id = ?
     LIMIT 1`,
    [id, userId]
  );

  return rows[0] ?? null;
}

export async function createGift(userId: number, data: GiftInput) {
  const [result] = await (await connection).query<ResultSetHeader>(
    `INSERT INTO gifts
      (user_id, recipient_name, gift_name, occasion, budget, event_date, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      data.recipient_name,
      data.gift_name,
      data.occasion,
      data.budget,
      data.event_date,
      data.status,
    ]
  );

  return result.insertId;
}

export async function updateGift(
  id: number,
  userId: number,
  data: GiftInput
) {
  const [result] = await (await connection).query<ResultSetHeader>(
    `UPDATE gifts
     SET recipient_name = ?, gift_name = ?, occasion = ?,
         budget = ?, event_date = ?, status = ?
     WHERE id = ? AND user_id = ?`,
    [
      data.recipient_name,
      data.gift_name,
      data.occasion,
      data.budget,
      data.event_date,
      data.status,
      id,
      userId,
    ]
  );

  return result.affectedRows;
}

export async function deleteGift(id: number, userId: number) {
  const [result] = await (await connection).query<ResultSetHeader>(
    `DELETE FROM gifts
     WHERE id = ? AND user_id = ?`,
    [id, userId]
  );

  return result.affectedRows;
}
