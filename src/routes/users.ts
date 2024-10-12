import express from "express";
import {
  fetchSessionUser,
  getRefreshToken,
  logout,
  registerCustomer,
  test,
} from "../controllers/usersController";
import { isAuth } from "../middlewares/authMiddlewares";

const router = express.Router();

router.get("/fetch-session-user", fetchSessionUser);
router.post("/refresh-token", getRefreshToken);
router.get("/test", isAuth, test);
router.post("/customer/register", registerCustomer);
router.get("/logout", logout);

export default router;
