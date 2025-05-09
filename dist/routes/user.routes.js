"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const utils_1 = require("../utils");
const upload_1 = __importDefault(require("../middlewares/upload"));
const router = (0, express_1.Router)();
// all routes goes here
router.post("/signin", (0, utils_1.tryCatch)(controllers_1.signin));
router.post("/signup", upload_1.default.single("profilePicture"), (0, utils_1.tryCatch)(controllers_1.signup));
exports.default = router;
