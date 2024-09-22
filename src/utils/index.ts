import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary";

export const generateToken = (id: string) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET as string);
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
