import express from "express";
import {
  checkVerification,
  sendEmail,
  verifyEmail,
} from "../controllers/verificationController";
import { isAuth } from "../middlewares/authMiddlewares";

const router = express.Router();

router.post("/send-email", isAuth, sendEmail);
router.put("/verify", verifyEmail);
router.get("/check", isAuth, checkVerification);

export default router;
