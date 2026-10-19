
import { Router } from "express";

import { register, login, getProfile } from "../controllers/authController";

import uploadProfileImage from "../middlewares/uploadMiddleware";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", uploadProfileImage, register);
router.post("/login", login);

// Hanya bisa diakses dengan JWT yang valid.
router.get("/me", authMiddleware, getProfile);

export default router;
