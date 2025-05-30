"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema = new mongoose_1.default.Schema({
    type: {
        type: String,
        enum: ["personal", "group"],
        required: true,
    },
    members: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    ],
    messages: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Message",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const Chat = mongoose_1.default.model("Chat", chatSchema);
exports.default = Chat;
