import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface addressIFace {
  _id: string;
  cityId: string;
  lat: string;
  long: string;
  preciseAddress: string;
  villageId: string;
}

export interface businessSchemaIFace {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  gender: string;
  image: string;
  imageId: string;
  companyName: string;
  est: string;
  description: string;
  addresses: addressIFace[];
  authType: string;
  categories: {
    categoryId: string;
    subcategoryId: string;
  }[];
  links: {
    facebook: string;
    instagram: string;
    tiktok: string;
    website: string;
    youtube: string;
  };
  tags: {
    _id: string;
    value: string;
  }[];
  plan: string;
  isVerified: boolean;
}

const businessSchema = new mongoose.Schema<businessSchemaIFace>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String, required: true },
    image: { type: String },
    imageId: { type: String },
    companyName: { type: String, required: true },
    est: { type: String },
    description: { type: String },
    addresses: [
      {
        cityId: { type: String },
        lat: { type: String },
        long: { type: String },
        preciseAddress: { type: String },
        villageId: { type: String },
      },
    ],
    authType: {
      type: String,
      enum: ["customer", "business"],
      default: "business",
    },
    categories: [
      {
        categoryId: { type: String },
        subcategoryId: { type: String },
      },
    ],
    links: {
      facebook: { type: String },
      instagram: { type: String },
      tiktok: { type: String },
      youtube: { type: String },
      website: { type: String },
    },
    tags: [
      {
        value: { type: String },
      },
    ],
    plan: {
      type: String,
      enum: ["free", "standard", "premium"],
      default: "free",
    },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

businessSchema.pre("save", async function (next) {
  if (this.password) {
    if (!this.isModified("password")) next();
    this.password = await bcrypt.hash(this.password, 8);
  }
});

export default mongoose.model<businessSchemaIFace>("Business", businessSchema);
