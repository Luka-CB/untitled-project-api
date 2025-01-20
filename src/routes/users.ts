import express from "express";
import {
  fetchSessionUser,
  getRefreshToken,
  login,
  logout,
  registerCustomer,
} from "../controllers/usersController";
import { isAuth } from "../middlewares/authMiddlewares";

const router = express.Router();

router.get("/fetch-session-user", fetchSessionUser);
router.post("/refresh-token", getRefreshToken);
router.post("/register", registerCustomer);
router.post("/login", login);
router.get("/logout", logout);

export default router;
