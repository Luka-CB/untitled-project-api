import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary";

export const generateAccessToken = (id: string) => {
  const token = jwt.sign({ id }, process.env.ACCESS_TOKEN_KEY as string, {
    expiresIn: "15m",
  });
  return token;
};

export const generateRefreshToken = (id: string) => {
  const token = jwt.sign({ id }, process.env.REFRESH_TOKEN_KEY as string, {
    expiresIn: "7d",
  });
  return token;
};

export const uploadImage = async (image: string, folderName: string) => {
  const result = await cloudinary.v2.uploader.unsigned_upload(
    image,
    "untitled",
    { folder: `untitled/${folderName}` }
  );

  return result;
};
