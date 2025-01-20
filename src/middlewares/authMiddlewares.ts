import jwt, { JwtPayload } from "jsonwebtoken";
import Customer, { customerSchemaIFace } from "../models/Customer";
import { RequestHandler } from "express";
import Business, { businessSchemaIFace } from "../models/Business";

export const isAuth: RequestHandler = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded: JwtPayload | any = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_KEY as string
      );

      const customer: customerSchemaIFace | null =
        (await Customer.findById(decoded.id).select("-password")) || null;
      const business: businessSchemaIFace | null =
        (await Business.findById(decoded.id).select("-password")) || null;

      if (customer) {
        req.user = customer;
      } else if (business) {
        req.user = business;
      } else {
        req.user = undefined;
      }

      next();
    } catch (error) {
      return res.status(401).json({ msg: "Not authorized, token failed!" });
    }
  } else {
    return res.status(401).json({ msg: "Not authorized, no token!" });
  }
};
