import mongoose from "mongoose";

interface municipalitySchemaIFace {
  _id: string;
  name: {
    en: string;
    ka: string;
  };
  region: string | unknown;
}

const municipalitySchema = new mongoose.Schema<municipalitySchemaIFace>({
  name: {
    en: { type: String, required: true },
    ka: { type: String, required: true },
  },
  region: { type: mongoose.Schema.Types.ObjectId, ref: "Region" },
});

export default mongoose.model<municipalitySchemaIFace>(
  "Municipality",
  municipalitySchema
);
