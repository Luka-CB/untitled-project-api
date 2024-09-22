import { RequestHandler } from "express";
import expressAsyncHandler from "express-async-handler";
import { customerSchemaIFace } from "../models/Customer";
import { generateToken } from "../utils";

///////////////--FETCH SESSION USER--///////////////
// ROUTE - api/users/fetch-session-user
export const fetchSessionUser: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const user = req.user as customerSchemaIFace;

    if (!user) {
      res.json({ msg: "no session user!" });
      return;
    }

    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      image: user.image,
      token,
    });
  }
);

///////////////--LOGOUT USER--///////////////
// ROUTE - api/users/logout
export const logout: RequestHandler = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ msg: "success" });
  });
};
