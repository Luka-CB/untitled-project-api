import mongoose from "mongoose";

export interface planSchemaIFace {
  _id: string;
  name: {
    en: string;
    ka: string;
  };
  price: number;
  subscribers: number;
  image: string;
  attrs: {
    posts: string;
    accounts: number;
  };
}

const planSchema = new mongoose.Schema<planSchemaIFace>({
  name: {
    en: { type: String, enum: ["free", "standard", "premium"], required: true },
    ka: {
      type: String,
      enum: ["უფასო", "სტანდარტული", "პრემიუმი"],
      required: true,
    },
  },
  price: { type: Number, required: true },
  subscribers: { type: Number, required: true, default: 0 },
  image: { type: String, required: true },
  attrs: {
    posts: { type: String, required: true },
    accounts: { type: Number, required: true },
  },
});

export default mongoose.model<planSchemaIFace>("Plan", planSchema);
