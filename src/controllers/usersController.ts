import { RequestHandler } from "express";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { customerSchemaIFace } from "../models/Customer";
import {
  generateAccessToken,
  generateRefreshToken,
  uploadImage,
} from "../utils";
import Customer from "../models/Customer";

///////////////--FETCH SESSION USER--///////////////
// ROUTE - GET - api/users/fetch-session-user
export const fetchSessionUser: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const user = req.user as customerSchemaIFace;

    if (!user) {
      res.json({ msg: "no session user!" });
      return;
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });

    res.status(200).json({
      _id: user._id,
      username: user.username,
      image: user.image,
      accessToken,
    });
  }
);

///////////////--REGISTER NEW CUSTOMER--///////////////
// ROUTE - POST - api/users/customer/register
export const registerCustomer: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const { firstName, lastName, email, image, gender, password } = req.body;

    const customer = await Customer.findOne({ email });
    if (customer) throw new Error("User with this email already exists!");

    let uploadedImage: any;
    if (image) {
      const result = await uploadImage(image, "customer/profile");
      if (!result) throw new Error("Failed to upload image");
      uploadedImage = result;
    }

    const newCustomer = await Customer.create({
      firstName,
      lastName,
      username: `${firstName} ${lastName}`,
      email,
      image: uploadedImage?.secure_url || "",
      imageId: uploadedImage?.public_id || "",
      gender,
      password,
    });

    if (!newCustomer) throw new Error("Something went wrong!");

    const accessToken = generateAccessToken(newCustomer._id);
    const refreshToken = generateRefreshToken(newCustomer._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });

    const user = {
      _id: newCustomer._id,
      username: newCustomer.username,
      image: newCustomer.image,
      accessToken,
    };

    res.status(200).json({ msg: "success", user });
  }
);

export const test: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    res.json({ msg: "here's your requested file" });
  }
);

///////////////--REFRESH TOKEN--///////////////
// ROUTE - POST - api/users/refresh-token
export const getRefreshToken: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw new Error("No refresh token provided!");

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_KEY as string,
      (err: any, user: any) => {
        if (err) return res.status(403).json({ msg: "Invalid refresh token!" });

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict",
        });
        res.status(200).json({ accessToken });
      }
    );
  }
);

///////////////--LOGOUT USER--///////////////
// ROUTE - api/users/logout
export const logout: RequestHandler = (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.sendStatus(204);
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
  });
  res.status(200).json({ msg: "Success" });
};
