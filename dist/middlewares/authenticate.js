"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const utils_1 = require("../utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.authenticate = (0, utils_1.tryCatch)(async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return (0, utils_1.errorResponse)(401, "Unauthorized");
    }
    const user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
});
