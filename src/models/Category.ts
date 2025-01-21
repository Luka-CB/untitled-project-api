import mongoose from "mongoose";

export interface categorySchemaIFace {
  _id: string;
  category: {
    en: string;
    ka: string;
  };
  subcategories: {
    _id: string;
    name: {
      en: string;
      ka: string;
    };
  }[];
}

const categorySchema = new mongoose.Schema<categorySchemaIFace>({
  category: {
    en: { type: String, required: true },
    ka: { type: String, required: true },
  },
  subcategories: [
    {
      name: {
        en: { type: String, required: true },
        ka: { type: String, required: true },
      },
    },
  ],
});

export default mongoose.model<categorySchemaIFace>("Category", categorySchema);
