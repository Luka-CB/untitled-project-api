import jwt, { JwtPayload } from "jsonwebtoken";
import Customer from "../models/Customer";
import { RequestHandler } from "express";

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
      req.user =
        (await Customer.findById(decoded.id).select("-password")) || {};
      next();
    } catch (error) {
      return res.status(401).json({ msg: "Not authorized, token failed!" });
    }
  } else {
    return res.status(401).json({ msg: "Not authorized, no token!" });
  }
};
