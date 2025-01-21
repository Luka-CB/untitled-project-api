import express from "express";
import { createPlan, getPlans } from "../controllers/planController";
import { isAuth } from "../middlewares/authMiddlewares";

const router = express.Router();

router.post("/create", createPlan);
router.get("/fetch", getPlans);

export default router;
