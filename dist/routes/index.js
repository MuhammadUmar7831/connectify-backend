"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendRequestRouter = exports.messageRouter = exports.groupRouter = exports.chatRouter = exports.userRouter = void 0;
var user_routes_1 = require("./user.routes");
Object.defineProperty(exports, "userRouter", { enumerable: true, get: function () { return __importDefault(user_routes_1).default; } });
var chat_routes_1 = require("./chat.routes");
Object.defineProperty(exports, "chatRouter", { enumerable: true, get: function () { return __importDefault(chat_routes_1).default; } });
var group_routes_1 = require("./group.routes");
Object.defineProperty(exports, "groupRouter", { enumerable: true, get: function () { return __importDefault(group_routes_1).default; } });
var message_routes_1 = require("./message.routes");
Object.defineProperty(exports, "messageRouter", { enumerable: true, get: function () { return __importDefault(message_routes_1).default; } });
var friendRequest_routes_1 = require("./friendRequest.routes");
Object.defineProperty(exports, "friendRequestRouter", { enumerable: true, get: function () { return __importDefault(friendRequest_routes_1).default; } });
