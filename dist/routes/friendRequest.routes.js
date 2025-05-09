"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const utils_1 = require("../utils");
const controllers_1 = require("../controllers");
const authenticate_1 = require("../middlewares/authenticate");
const router = (0, express_1.Router)();
// all routes goes here
router.get("/", authenticate_1.authenticate, (0, utils_1.tryCatch)(controllers_1.getFriendRequests));
router.post("/send", authenticate_1.authenticate, (0, utils_1.tryCatch)(controllers_1.sendFriendRequest));
router.put("/update-status", authenticate_1.authenticate, (0, utils_1.tryCatch)(controllers_1.updateStatus));
exports.default = router;
