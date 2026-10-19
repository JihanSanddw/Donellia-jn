import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import adminMiddleware from "../middlewares/adminMiddleware";
import { getMembers, getMemberDetail, changeMemberStatus } from "../controllers/adminMemberController";

const router = Router();

// Semua endpoint di bawah ini membutuhkan JWT valid dan role admin.
router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/members", getMembers);
router.get("/members/:id", getMemberDetail);
router.patch("/members/:id/status", changeMemberStatus);

export default router;
