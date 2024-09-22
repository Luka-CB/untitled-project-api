import express from "express";
import { fetchSessionUser, logout } from "../controllers/usersController";

const router = express.Router();

router.get("/fetch-session-user", fetchSessionUser);
router.get("/logout", logout);

export default router;
