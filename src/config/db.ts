import mongoose from "mongoose";
import { DB_NAME, MONGO_URI } from "./constants";

console.log('MONGO_URI', MONGO_URI)
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: DB_NAME,
    });

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
}

export default connectDB;
