import mongoose, { MongooseError } from "mongoose";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    const uri: string | any = process.env.MONGODB_URI;
    const conn = await mongoose.connect(uri);
    console.log(
      `MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
    );
  } catch (error: MongooseError | any) {
    console.log(`Error Connected MongoDB: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

export default connectDB;
