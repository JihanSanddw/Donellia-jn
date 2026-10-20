import type { Request, Response } from "express";
import { getAllGifts, getGiftById, createGift, updateGift, deleteGift, type GiftInput } from "../models/giftModel";

const statuses = ["planned", "purchased", "given"];

function getUserId(req: Request): number {
  return Number((req as any).user.id);
}

function validateInput(body: any): string | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "Body request harus berupa JSON object";
  }

  if (
    typeof body.recipient_name !== "string" ||
    body.recipient_name.trim().length < 1 ||
    body.recipient_name.trim().length > 100
  ) {
    return "Nama penerima wajib diisi dan maksimal 100 karakter";
  }

  if (
    typeof body.gift_name !== "string" ||
    body.gift_name.trim().length < 1 ||
    body.gift_name.trim().length > 150
  ) {
    return "Nama hadiah wajib diisi dan maksimal 150 karakter";
  }

  if (
    body.occasion !== undefined &&
    body.occasion !== null &&
    (typeof body.occasion !== "string" || body.occasion.length > 100)
  ) {
    return "Acara maksimal 100 karakter";
  }

  if (body.budget !== undefined && body.budget !== null) {
    const budget = Number(body.budget);

    if (
      typeof body.budget === "boolean" ||
      (typeof body.budget !== "number" &&
        typeof body.budget !== "string") ||
      (typeof body.budget === "string" && !body.budget.trim()) ||
      !Number.isFinite(budget) ||
      budget < 0 ||
      !/^\d{1,10}(\.\d{1,2})?$/.test(String(body.budget))
    ) {
      return "Anggaran harus berupa angka nonnegatif dengan maksimal 2 angka desimal";
    }
  }

  if (
    body.event_date !== undefined &&
    body.event_date !== null
  ) {
    if (
      typeof body.event_date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(body.event_date)
    ) {
      return "Tanggal acara harus menggunakan format YYYY-MM-DD";
    }

    const date = new Date(`${body.event_date}T00:00:00Z`);

    if (
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== body.event_date
    ) {
      return "Tanggal acara tidak valid";
    }
  }

  if (
    body.status !== undefined &&
    !statuses.includes(body.status)
  ) {
    return "Status harus planned, purchased, atau given";
  }

  return null;
}

function getInput(body: any): GiftInput {
  return {
    recipient_name: body.recipient_name.trim(),
    gift_name: body.gift_name.trim(),
    occasion:
      typeof body.occasion === "string" && body.occasion.trim()
        ? body.occasion.trim()
        : null,
    budget:
      body.budget === undefined || body.budget === null
        ? null
        : Number(body.budget),
    event_date: body.event_date ?? null,
    status: body.status ?? "planned",
  };
}

// GET /api/gifts
export async function getGifts(req: Request, res: Response) {
  try {
    const gifts = await getAllGifts(getUserId(req));

    return res.status(200).json({
      success: true,
      data: gifts,
    });
  } catch (error) {
    console.error("Get gifts failed:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil daftar hadiah",
    });
  }
}

// GET /api/gifts/:id
export async function getGift(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID hadiah tidak valid",
      });
    }

    const gift = await getGiftById(id, getUserId(req));

    if (!gift) {
      return res.status(404).json({
        success: false,
        message: "Hadiah tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      data: gift,
    });
  } catch (error) {
    console.error("Get gift failed:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil detail hadiah",
    });
  }
}

// POST /api/gifts
export async function addGift(req: Request, res: Response) {
  try {
    const validationError = validateInput(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const userId = getUserId(req);
    const id = await createGift(userId, getInput(req.body));
    const gift = await getGiftById(id, userId);

    return res.status(201).json({
      success: true,
      message: "Hadiah berhasil ditambahkan",
      data: gift,
    });
  } catch (error) {
    console.error("Create gift failed:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal menambahkan hadiah",
    });
  }
}

// PUT /api/gifts/:id
export async function editGift(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID hadiah tidak valid",
      });
    }

    const validationError = validateInput(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const userId = getUserId(req);
    const existingGift = await getGiftById(id, userId);

    if (!existingGift) {
      return res.status(404).json({
        success: false,
        message: "Hadiah tidak ditemukan",
      });
    }

    await updateGift(id, userId, getInput(req.body));
    const updatedGift = await getGiftById(id, userId);

    return res.status(200).json({
      success: true,
      message: "Hadiah berhasil diperbarui",
      data: updatedGift,
    });
  } catch (error) {
    console.error("Update gift failed:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal memperbarui hadiah",
    });
  }
}

// DELETE /api/gifts/:id
export async function removeGift(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID hadiah tidak valid",
      });
    }

    const affectedRows = await deleteGift(id, getUserId(req));

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Hadiah tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hadiah berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete gift failed:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal menghapus hadiah",
    });
  }
}
