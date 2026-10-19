import type { Request, Response } from "express";
import { getAllMembers, getMemberById, updateMemberStatus } from "../models/adminMemberModel";

// GET /api/admin/members
export async function getMembers(req: Request, res: Response) {
  try {
    const members = await getAllMembers();

    return res.status(200).json({
      success: true,
      message: "Daftar member berhasil diambil",
      data: members,
    });
  } catch (error) {
    console.error("Get members failed:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil daftar member",
    });
  }
}

// GET /api/admin/members/:id
export async function getMemberDetail(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID member tidak valid",
      });
    }

    const member = await getMemberById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Detail member berhasil diambil",
      data: member,
    });
  } catch (error) {
    console.error("Get member detail failed:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil detail member",
    });
  }
}

// PATCH /api/admin/members/:id/status
export async function changeMemberStatus(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);
    const { is_active } = req.body;
    const adminId = Number((req as any).user.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID member tidak valid",
      });
    }

    if (typeof is_active !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "is_active harus berupa true atau false",
      });
    }

    if (id === adminId) {
      return res.status(403).json({
        success: false,
        message: "Admin tidak dapat mengubah status akunnya sendiri",
      });
    }

    const member = await getMemberById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member tidak ditemukan",
      });
    }

    await updateMemberStatus(id, is_active);

    return res.status(200).json({
      success: true,
      message: is_active
        ? "Akun member berhasil diaktifkan"
        : "Akun member berhasil dinonaktifkan",
      data: {
        id: member.id,
        username: member.username,
        is_active,
      },
    });
  } catch (error) {
    console.error("Change member status failed:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal mengubah status member",
    });
  }
}
