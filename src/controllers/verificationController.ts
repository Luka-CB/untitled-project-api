import { RequestHandler } from "express";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { customerSchemaIFace } from "../models/Customer";
import Customer from "../models/Customer";
import { transporter } from "../config/nodemailer";
import Business, { businessSchemaIFace } from "../models/Business";

///////////////--SEND VERIFICATION EMAIL TO THE USER--///////////////
// ROUTE - POST - api/verification/send-email?type
export const sendEmail: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const { type } = req.query;
    let user: any;

    if (req.user && type === "customer") {
      user = req.user as customerSchemaIFace;
    }

    if (req.user && type === "business") {
      user = req.user as businessSchemaIFace;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    const verificationLink = `http://localhost:5173/verified?token=${token}`;

    const result = await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Email Verification",
      html: `<h3>please click the link to <a href="${verificationLink}">verify your account</a></h3>`,
    });

    if (!result) throw new Error("Error sending email");

    res.status(200).json({ msg: "Email sent successfully!", result });
  }
);

///////////////--VERIFY EMAIL--///////////////
// ROUTE - PUT - api/verification/verify?type&token
export const verifyEmail: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const { type, token } = req.query;

    const decoded: any = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    );
    let updatedUser;

    if (type === "customer") {
      updatedUser = await Customer.updateOne(
        { _id: decoded.id },
        { isVerified: true }
      );
    } else {
      updatedUser = await Business.updateOne(
        { _id: decoded.id },
        { isVerified: true }
      );
    }

    if (!updatedUser)
      throw new Error("Request to verify email has failed, Invalid Token!");

    res.status(200).json({ msg: "Verification Success!" });
  }
);

///////////////--CHECK IF USER IS VERIFIED--///////////////
// ROUTE - GET - api/verification/check?type=type
export const checkVerification: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const { type } = req.query;

    if (req.user && type === "business") {
      const user = req.user as businessSchemaIFace;
      const business = await Business.findOne({ _id: user._id });

      let status = null;

      if (business?.isVerified) {
        status = true;
      } else {
        status = false;
      }

      res.status(200).json(status);
    }

    if (req.user && type === "customer") {
      const user = req.user as customerSchemaIFace;
      const customer = await Customer.findOne({ _id: user._id });

      let status = null;

      if (customer?.isVerified) {
        status = true;
      } else {
        status = false;
      }

      res.status(200).json(status);
    }
  }
);
