import express from "express";
import {
  changePassword,
  checkVerification,
  sendEmail,
  sendPasswordEmail,
  verifyEmail,
} from "../controllers/verificationController";
import { isAuth } from "../middlewares/authMiddlewares";

const router = express.Router();

router.post("/send-email", isAuth, sendEmail);
router.post("/password/send-email", sendPasswordEmail);
router.put("/password/change", changePassword);
router.put("/verify", verifyEmail);
router.get("/check", isAuth, checkVerification);

export default router;
