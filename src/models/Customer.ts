import mongoose from "mongoose";
import bcrypt from "bcrypt";

interface customerIFace {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  image: string;
  imageId: string;
  isCustomer: boolean;
  provider: string;
  providerId: string;
}

const customerSchema = new mongoose.Schema<customerIFace>(
  {
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    image: { type: String },
    imageId: { type: String },
    isCustomer: { type: Boolean, default: true },
    provider: { type: String, default: "local" },
    providerId: { type: String },
  },
  {
    timestamps: true,
  }
);

customerSchema.pre("save", async function (next) {
  if (this.password) {
    if (!this.isModified("password")) next();
    this.password = await bcrypt.hash(this.password, 8);
  }
});

export default mongoose.model<customerIFace>("Customer", customerSchema);
