import mongoose from "mongoose";

interface villageSchemaIFace {
  _id: string;
  name: {
    en: string;
    ka: string;
  };
  municipality: string | unknown;
}

const villageSchema = new mongoose.Schema<villageSchemaIFace>({
  name: {
    en: { type: String, required: true },
    ka: { type: String, required: true },
  },
  municipality: { type: mongoose.Schema.Types.ObjectId, ref: "Municipality" },
});

export default mongoose.model<villageSchemaIFace>("Village", villageSchema);
