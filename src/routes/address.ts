import express from "express";
import { getCities, getRegions } from "../controllers/addressControllers";

const router = express.Router();

router.get("/cities", getCities).get("/regions", getRegions);

export default router;
