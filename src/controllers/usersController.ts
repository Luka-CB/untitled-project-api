import { RequestHandler } from "express";
import expressAsyncHandler from "express-async-handler";
import { customerSchemaIFace } from "../models/Customer";
import { generateToken, uploadImage } from "../utils";
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

    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      image: user.image,
      token,
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

    const token = generateToken(newCustomer._id);
    const user = {
      _id: newCustomer._id,
      username: newCustomer.username,
      image: newCustomer.image,
      token,
    };

    res.status(200).json({ msg: "success", user });
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
