"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendRequest = exports.Message = exports.Group = exports.Chat = exports.User = void 0;
var User_model_1 = require("./User.model");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return __importDefault(User_model_1).default; } });
var Chat_model_1 = require("./Chat.model");
Object.defineProperty(exports, "Chat", { enumerable: true, get: function () { return __importDefault(Chat_model_1).default; } });
var Group_model_1 = require("./Group.model");
Object.defineProperty(exports, "Group", { enumerable: true, get: function () { return __importDefault(Group_model_1).default; } });
var Message_model_1 = require("./Message.model");
Object.defineProperty(exports, "Message", { enumerable: true, get: function () { return __importDefault(Message_model_1).default; } });
var FriendRequest_model_1 = require("./FriendRequest.model");
Object.defineProperty(exports, "FriendRequest", { enumerable: true, get: function () { return __importDefault(FriendRequest_model_1).default; } });
