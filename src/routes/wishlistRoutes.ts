
import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { getItems, getItem, addItem, editItem, removeItem } from "../controllers/wishlistController";

const router = Router();

// Semua endpoint wishlist wajib menggunakan JWT.
router.use(authMiddleware);

router.get("/", getItems);
router.get("/:id", getItem);
router.post("/", addItem);
router.put("/:id", editItem);
router.delete("/:id", removeItem);

export default router;
