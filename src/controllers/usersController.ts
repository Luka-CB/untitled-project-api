import { RequestHandler } from "express";
import expressAsyncHandler from "express-async-handler";
import { customerIFace } from "../models/Customer";
import { generateToken } from "../utils";

///////////////--FETCH SESSION USER--///////////////
// ROUTE - api/users/fetch-session-user
export const fetchSessionUser: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const user = req.user as customerIFace;

    if (!user) {
      res.json({ msg: "no session user!" });
      return;
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      username: user.username,
      image: user.image,
      token,
    });
  }
);
