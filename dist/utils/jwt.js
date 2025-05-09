"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../config/constants");
function generateToken(payload, expiresIn = "1d") {
    return jsonwebtoken_1.default.sign(payload, constants_1.JWT_SECRET, { expiresIn });
}
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, constants_1.JWT_SECRET);
    }
    catch (error) {
        throw new Error("Invalid or expired token");
    }
}
