"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLOUDINARY_FOLDER = exports.CLOUDINARY_CLOUD_NAME = exports.CLOUDINARY_API_SECRET = exports.CLOUDINARY_API_KEY = exports.SALT_ROUNDS = exports.JWT_SECRET = exports.PORT = exports.DB_NAME = exports.MONGO_URI = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const environment = process.env.NODE_ENV || "development";
exports.MONGO_URI = environment === "development"
    ? process.env.MONGO_URI_DEV
    : process.env.MONGO_URI_PROD;
exports.DB_NAME = process.env.DB_NAME;
exports.PORT = process.env.PORT || 5000;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.SALT_ROUNDS = 10;
exports.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
exports.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
exports.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
exports.CLOUDINARY_FOLDER = "connectify";
