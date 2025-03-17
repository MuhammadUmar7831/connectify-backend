import dotenv from "dotenv";

dotenv.config();

export const MONGO_URI = process.env.MONGO_URI as string;
export const DB_NAME = process.env.DB_NAME as string;
export const PORT = process.env.PORT || 5000;
