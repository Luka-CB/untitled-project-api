import mongoose from "mongoose";

interface regionSchemaIFace {
  _id: string;
  name: {
    en: string;
    ka: string;
  };
}

const regionSchema = new mongoose.Schema<regionSchemaIFace>({
  name: {
    en: { type: String, required: true },
    ka: { type: String, required: true },
  },
});

export default mongoose.model<regionSchemaIFace>("Region", regionSchema);
