"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = sendMessage;
exports.getAllMessages = getAllMessages;
const message_validator_1 = require("../validations/message.validator");
const utils_1 = require("../utils");
const models_1 = require("../models");
const mongoose_1 = __importDefault(require("mongoose"));
async function sendMessage(req, res, next) {
    await message_validator_1.sendMessageSchema.validate(req.body);
    const { type, chatId, text, repliedTo } = req.body;
    const attachment = req.file;
    if (type !== "text" && !attachment) {
        return (0, utils_1.errorResponse)(400, "Attachment is required for non-text messages");
    }
    let link = undefined;
    if (type !== "text" && attachment) {
        if (!(0, message_validator_1.isValidMimeType)(type, attachment.mimetype)) {
            return (0, utils_1.errorResponse)(400, 'Uploaded file mimetype not match with the type');
        }
        if (type == "video") {
            link = await (0, utils_1.uploadVideo)(attachment);
        }
        else if (type == "image") {
            link = await (0, utils_1.uploadImage)(attachment);
        }
        else {
            link = await (0, utils_1.uploadAudio)(attachment);
        }
    }
    const chat = await models_1.Chat.findById(chatId);
    if (!chat) {
        return (0, utils_1.errorResponse)(404, "Chat not found");
    }
    if (!chat.members.includes(new mongoose_1.default.Types.ObjectId(req.user._id))) {
        return (0, utils_1.errorResponse)(401, "You are not member of this chat");
    }
    if (repliedTo) {
        const reply = await models_1.Message.findById(repliedTo);
        if (!reply) {
            return (0, utils_1.errorResponse)(404, "The message to which it is reply not found");
        }
        if (reply.chatId != chatId) {
            return (0, utils_1.errorResponse)(400, "The message to which this is reply does not belong this chat");
        }
    }
    const members = chat.members;
    const receipt = members
        .filter(member => member.toString() !== req.user._id.toString())
        .map(member => ({
        userId: member.toString(),
        status: "sent"
    }));
    // Transaction start
    const session = await mongoose_1.default.startSession();
    try {
        await session.withTransaction(async () => {
            const message = await models_1.Message.create({
                chatId,
                sender: req.user._id,
                text,
                type,
                link,
                repliedTo,
                receipt
            });
            await models_1.Chat.updateOne({ _id: chatId }, { $push: { messages: message._id } });
            res.status(200).send((0, utils_1.response)(message, "Message sent"));
        });
    }
    catch (e) {
        next(e);
    }
    finally {
        session.endSession();
    }
    // Transaction end
    return;
}
async function getAllMessages(req, res) {
    const { chatId } = req.params;
    const chat = await models_1.Chat.findById(chatId);
    if (!chat) {
        return (0, utils_1.errorResponse)(404, "Chat not found");
    }
    if (!chat.members.includes(new mongoose_1.default.Types.ObjectId(req.user._id))) {
        return (0, utils_1.errorResponse)(401, "You are not member of this chat");
    }
    const messages = await models_1.Message.find({ chatId })
        .populate("sender", "_id name profilePicture")
        .populate("repliedTo", "_id sender text link");
    return res.status(200).send((0, utils_1.response)(messages, "Messages retrieved"));
}
