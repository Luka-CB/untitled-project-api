import express from "express";
import {
  fetchSessionUser,
  getRefreshToken,
  logout,
  registerCustomer,
} from "../controllers/usersController";
import { isAuth } from "../middlewares/authMiddlewares";

const router = express.Router();

router.get("/fetch-session-user", fetchSessionUser);
router.post("/refresh-token", getRefreshToken);
router.post("/customer/register", registerCustomer);
router.get("/logout", logout);

export default router;
