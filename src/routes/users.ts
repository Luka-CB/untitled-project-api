import express from "express";
import { fetchSessionUser } from "../controllers/usersController";

const router = express.Router();

router.get("/fetch-session-user", fetchSessionUser);

export default router;
