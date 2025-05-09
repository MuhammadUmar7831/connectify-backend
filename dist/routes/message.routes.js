"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../middlewares/authenticate");
const utils_1 = require("../utils");
const message_controller_1 = require("../controllers/message.controller");
const upload_1 = __importDefault(require("../middlewares/upload"));
const router = (0, express_1.Router)();
// all routes goes here
router.post('/', authenticate_1.authenticate, upload_1.default.single("attachment"), (0, utils_1.tryCatch)(message_controller_1.sendMessage));
router.get('/:chatId', authenticate_1.authenticate, (0, utils_1.tryCatch)(message_controller_1.getAllMessages));
exports.default = router;
