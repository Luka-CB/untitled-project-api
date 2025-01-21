import express from "express";
import { registerBusiness } from "../controllers/businessController";
import { isAuth } from "../middlewares/authMiddlewares";

const router = express.Router();

router.post("/register", registerBusiness);

export default router;
