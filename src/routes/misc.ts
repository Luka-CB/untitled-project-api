import express from "express";
import {
  getCategories,
  getCities,
  getRegions,
} from "../controllers/miscControllers";

const router = express.Router();

router
  .get("/cities", getCities)
  .get("/regions", getRegions)
  .get("/categories", getCategories);

export default router;
