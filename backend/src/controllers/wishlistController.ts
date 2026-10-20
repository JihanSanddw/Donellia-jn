import type { Request, Response } from "express";
import { getAllItems, getItemById,createItem, updateItem, deleteItem, type WishlistInput } from "../models/wishlistModel";

const categories = ["todo", "wishlist", "goal"];
const priorities = ["low", "medium", "high"];
const statuses = ["planned", "in_progress", "completed"];

function getUserId(req: Request): number {
  return Number((req as any).user.id);
}

function validateInput(body: any): string | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "Body request harus berupa JSON object";
  }

  if (
    typeof body.title !== "string" ||
    body.title.trim().length < 1 ||
    body.title.trim().length > 150
  ) {
    return "Judul wajib diisi dan maksimal 150 karakter";
  }

  if (
    body.description !== undefined &&
    body.description !== null &&
    typeof body.description !== "string"
  ) {
    return "Deskripsi harus berupa teks";
  }

  if (!categories.includes(body.category)) {
    return "Kategori harus todo, wishlist, atau goal";
  }

  if (
    body.priority !== undefined &&
    !priorities.includes(body.priority)
  ) {
    return "Prioritas harus low, medium, atau high";
  }

  if (
    body.status !== undefined &&
    !statuses.includes(body.status)
  ) {
    return "Status harus planned, in_progress, atau completed";
  }

  if (
    body.target_date !== undefined &&
    body.target_date !== null
  ) {
    if (
      typeof body.target_date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(body.target_date)
    ) {
      return "Tanggal harus menggunakan format YYYY-MM-DD";
    }

    const date = new Date(`${body.target_date}T00:00:00Z`);

    if (
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== body.target_date
    ) {
      return "Tanggal tidak valid";
    }
  }

  return null;
}

function getInput(body: any): WishlistInput {
  return {
    title: body.title.trim(),
    description:
      typeof body.description === "string" && body.description.trim()
        ? body.description.trim()
        : null,
    category: body.category,
    priority: body.priority ?? "medium",
    status: body.status ?? "planned",
    target_date: body.target_date ?? null,
  };
}

// GET /api/wishlists
export async function getItems(req: Request, res: Response) {
  try {
    const items = await getAllItems(getUserId(req));

    return res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Get wishlist items failed:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil daftar item",
    });
  }
}

// GET /api/wishlists/:id
export async function getItem(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID item tidak valid",
      });
    }

    const item = await getItemById(id, getUserId(req));

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Get wishlist item failed:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil item",
    });
  }
}

// POST /api/wishlists
export async function addItem(req: Request, res: Response) {
  try {
    const validationError = validateInput(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const userId = getUserId(req);
    const id = await createItem(userId, getInput(req.body));
    const item = await getItemById(id, userId);

    return res.status(201).json({
      success: true,
      message: "Item berhasil ditambahkan",
      data: item,
    });
  } catch (error) {
    console.error("Create wishlist item failed:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal menambahkan item",
    });
  }
}

// PUT /api/wishlists/:id
export async function editItem(req: Request, res: Response) {
  try {
    const validationError = validateInput(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const id = Number(req.params.id);
    const userId = getUserId(req);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID item tidak valid",
      });
    }

    const existingItem = await getItemById(id, userId);

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Item tidak ditemukan",
      });
    }

    await updateItem(id, userId, getInput(req.body));
    const updatedItem = await getItemById(id, userId);

    return res.status(200).json({
      success: true,
      message: "Item berhasil diperbarui",
      data: updatedItem,
    });
  } catch (error) {
    console.error("Update wishlist item failed:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal memperbarui item",
    });
  }
}

// DELETE /api/wishlists/:id
export async function removeItem(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID item tidak valid",
      });
    }

    const affectedRows = await deleteItem(id, getUserId(req));

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Item tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete wishlist item failed:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal menghapus item",
    });
  }
}
