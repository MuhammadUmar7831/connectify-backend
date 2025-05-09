"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("./constants");
console.log('MONGO_URI', constants_1.MONGO_URI);
async function connectDB() {
    try {
        await mongoose_1.default.connect(constants_1.MONGO_URI, {
            dbName: constants_1.DB_NAME,
        });
        console.log("✅ MongoDB Connected Successfully");
    }
    catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
}
exports.default = connectDB;
