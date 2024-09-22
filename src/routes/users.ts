import express from "express";
import {
  fetchSessionUser,
  logout,
  registerCustomer,
} from "../controllers/usersController";

const router = express.Router();

router.get("/fetch-session-user", fetchSessionUser);
router.post("/customer/register", registerCustomer);
router.get("/logout", logout);

export default router;
