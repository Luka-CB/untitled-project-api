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
import Business, { businessSchemaIFace } from "../models/Business";
import { transporter } from "../config/nodemailer";

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
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      _id: user._id,
      username: user.username,
      image: user.image,
      authType: user.authType,
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
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const user = {
      _id: newCustomer._id,
      username: newCustomer.username,
      image: newCustomer.image,
      authType: newCustomer.authType,
      accessToken,
    };

    res.status(200).json({ msg: "success", user });
  }
);

///////////////--GET USER PROFILE--///////////////
// ROUTE - POST - api/users/login
export const getProfile: RequestHandler = expressAsyncHandler(
  async (req, res) => {
    const user = req.user as customerSchemaIFace | businessSchemaIFace;
    if (!user) throw new Error("No user found!");

    if (user.authType === "customer") {
      const customer = await Customer.findById(user._id);
      if (!customer) throw new Error("No customer found!");

      res.status(200).json({
        _id: customer._id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        image: customer.image,
      });
    } else {
      const business = await Business.findById(user._id);
      if (!business) throw new Error("No business found!");

      res.status(200).json({
        _id: business._id,
        firstName: business.firstName,
        lastName: business.lastName,
        email: business.email,
        image: business.image,
        bannerImage: business.bannerImage,
        companyName: business.companyName,
        est: business.est,
        description: business.description,
        addresses: business.addresses,
        links: business.links,
      });
    }
  }
);

///////////////--SIGN IN CUSTOMER--///////////////
// ROUTE - POST - api/users/login
export const login: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const { email, password, type, lang } = req.body;

    let user: any;

    if (type === "customer") {
      user = await Customer.findOne({ email });
    } else {
      user = await Business.findOne({ email });
    }

    const emailErrMsg =
      lang === "ka" ? "მეილი არასწორია!" : "Email is Incorrect!";
    const passwordErrMsg =
      lang === "ka" ? "ფასვორდი არასწორია!" : "Password is Incorrect!";

    if (!user) throw new Error(emailErrMsg);
    if (!(await user.matchPassword(password))) throw new Error(passwordErrMsg);

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userData = {
      _id: user._id,
      username: user.username,
      image: user.image,
      authType: user.authType,
      accessToken,
    };

    res.status(200).json({ msg: "success", user: userData });
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
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ accessToken });
      }
    );
  }
);

///////////////--LOGOUT USER--///////////////
// ROUTE - GET - api/users/logout
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
