"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = require("../controllers");
const express_1 = require("express");
const authenticate_1 = require("../middlewares/authenticate");
const utils_1 = require("../utils");
const upload_1 = __importDefault(require("../middlewares/upload"));
const router = (0, express_1.Router)();
// all routes goes here
router.post("/personal", authenticate_1.authenticate, (0, utils_1.tryCatch)(controllers_1.createPersonalChat));
router.post("/group", authenticate_1.authenticate, upload_1.default.single("picture"), (0, utils_1.tryCatch)(controllers_1.createGroupChat));
router.get("/", authenticate_1.authenticate, (0, utils_1.tryCatch)(controllers_1.getAllChats));
exports.default = router;
