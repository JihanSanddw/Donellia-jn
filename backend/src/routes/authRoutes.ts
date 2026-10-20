import { Router } from "express";
import { register, login, getProfile, updateAvatar } from "../controllers/authController";

import uploadProfileImage from "../middlewares/uploadMiddleware";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", uploadProfileImage, register);
router.post("/login", login);

// Hanya pengguna dengan JWT valid yang dapat mengakses profil.
router.get("/me", authMiddleware, getProfile);

// Mengganti foto profil pengguna yang sedang login.
router.patch("/avatar", authMiddleware, uploadProfileImage, updateAvatar);

export default router;