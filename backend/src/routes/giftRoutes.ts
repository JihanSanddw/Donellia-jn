import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { getGifts, getGift, addGift, editGift, removeGift } from "../controllers/giftController";

const router = Router();

router.use(authMiddleware);

router.get("/", getGifts);
router.get("/:id", getGift);
router.post("/", addGift);
router.put("/:id", editGift);
router.delete("/:id", removeGift);

export default router;
