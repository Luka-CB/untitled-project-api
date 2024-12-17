import { RequestHandler } from "express";
import expressAsyncHandler from "express-async-handler";
import Plan from "../models/Plan";

///////////////--CREATE NEW PLAN--///////////////
// ROUTE - POST - api/plan/create
export const createPlan: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const { name, price, attrs } = req.body;

    const newPlan = await Plan.create({
      name,
      price,
      attrs,
    });

    if (!newPlan) throw new Error("Request to create plan has failed!");
    res.status(200).json({ msg: "Created Successfully!" });
  }
);

///////////////--FETCH PLANS--///////////////
// ROUTE - GET - api/plan/fetch
export const getPlans: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const plans = await Plan.find();

    if (!plans) throw new Error("Request to fetch plans has failed!");
    res.status(200).json(plans);
  }
);
