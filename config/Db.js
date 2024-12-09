import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to mongodb");
  } catch (error) {
    console.log("mongodb error ${error}");
  }
};
export default connectDB;
