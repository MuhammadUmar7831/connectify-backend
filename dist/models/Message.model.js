"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    chatId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
    },
    sender: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        trim: true,
    },
    type: {
        type: String,
        enum: ["text", "image", "video", "audio", "link"],
        required: true,
    },
    link: {
        type: String,
        default: null,
    },
    repliedTo: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Message",
        default: null,
    },
    receipt: [
        {
            userId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "User",
            },
            status: {
                type: String,
                enum: ["received", "sent", "seen"],
                required: true,
            }
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
});
const Message = mongoose_1.default.model("Message", messageSchema);
exports.default = Message;
