import mongoose from "mongoose";

interface citySchemaIFace {
  _id: string;
  name: {
    en: string;
    ka: string;
  };
}

const citySchema = new mongoose.Schema<citySchemaIFace>({
  name: {
    en: { type: String, required: true },
    ka: { type: String, required: true },
  },
});

export default mongoose.model<citySchemaIFace>("City", citySchema);
