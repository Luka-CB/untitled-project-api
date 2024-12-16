import { RequestHandler } from "express";
import expressAsyncHandler from "express-async-handler";
import {
  generateAccessToken,
  generateRefreshToken,
  uploadImage,
} from "../utils";
import Business from "../models/Business";

///////////////--REGISTER NEW BUSINESS--///////////////
// ROUTE - POST - api/business/register
export const registerBusiness: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const data = req.body;

    const business = await Business.findOne({ email: data.email });
    if (business)
      throw new Error("This email is already exists in our database!");

    let uploadedImage: any;
    if (data.image) {
      const result = await uploadImage(data.image, "business/profile");
      if (!result) throw new Error("Failed to upload image");
      uploadedImage = result;
    }

    const newBusiness = await Business.create({
      firstName: data.firstName,
      lastName: data.lastName,
      username: `${data.firstName} ${data.lastName}`,
      email: data.email,
      image: uploadedImage?.secure_url || "",
      imageId: uploadedImage?.public_id || "",
      gender: data.gender,
      password: data.password,
      companyName: data.companyName,
      est: data.est,
      description: data.description,
      addresses: data.addresses,
      categories: data.categories,
      links: data.links,
      tags: data.tags,
    });

    if (!newBusiness) throw new Error("Something went wrong!");

    const accessToken = generateAccessToken(newBusiness._id);
    const refreshToken = generateRefreshToken(newBusiness._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const user = {
      _id: newBusiness._id,
      username: newBusiness.username,
      image: newBusiness.image,
      accessToken,
    };

    res.status(200).json({ msg: "success", user });
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
