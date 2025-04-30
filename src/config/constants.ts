import dotenv from "dotenv";

dotenv.config();

const environment = process.env.NODE_ENV || "development";

export const MONGO_URI =
  environment === "development"
    ? (process.env.MONGO_URI_DEV as string)
    : (process.env.MONGO_URI_PROD as string);
export const DB_NAME = process.env.DB_NAME as string;
export const PORT = process.env.PORT || 5000;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const SALT_ROUNDS = 10;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_FOLDER = "connectify";
