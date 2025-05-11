"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPersonalChat = createPersonalChat;
exports.createGroupChat = createGroupChat;
exports.getAllChats = getAllChats;
const models_1 = require("../models");
const chat_validator_1 = require("../validations/chat.validator");
const utils_1 = require("../utils");
const mongoose_1 = __importDefault(require("mongoose"));
async function createPersonalChat(req, res) {
    await chat_validator_1.createPersonalChatSchema.validate(req.body);
    const { userId } = req.body;
    const existingChat = await models_1.Chat.findOne({
        type: "personal",
        members: { $all: [req.user._id, userId], $size: 2 }
    });
    if (existingChat) {
        return (0, utils_1.errorResponse)(400, "You already have a personal chat with this user");
    }
    const chat = await models_1.Chat.create({ type: "personal", members: [req.user._id, userId] });
    return res.status(200).send((0, utils_1.response)(chat, "Chat created"));
}
async function createGroupChat(req, res) {
    await chat_validator_1.createGroupChatSchema.validate(req.body);
    const pictureFile = req.file;
    const payload = req.body;
    const members = Array.from(new Set([...req.body.members, req.user._id]));
    if (members.length == 0) {
        return (0, utils_1.errorResponse)(400, "At least one member is required");
    }
    if (pictureFile) {
        const profilePictureUrl = await (0, utils_1.uploadImage)(pictureFile);
        payload.picture = profilePictureUrl;
    }
    else {
        return (0, utils_1.errorResponse)(400, "Group picture is required");
    }
    const chat = await models_1.Chat.create({ type: "group", members });
    const group = await models_1.Group.create({
        admins: [req.user._id],
        chatId: chat._id,
        description: payload.description,
        name: payload.name,
        picture: payload.picture
    });
    return res.status(200).send((0, utils_1.response)({ chat, group }, "Chat created"));
}
async function getAllChats(req, res) {
    const userId = new mongoose_1.default.Types.ObjectId(req.user._id);
    const chats = await models_1.Chat.aggregate([
        {
            $match: {
                members: { $in: [userId] }
            }
        },
        {
            $lookup: {
                from: "messages",
                foreignField: "_id",
                localField: "messages",
                as: "messages",
            }
        },
        {
            $set: {
                messages: {
                    $sortArray: {
                        input: "$messages",
                        sortBy: { createdAt: -1 }
                    }
                }
            }
        },
        {
            $addFields: {
                lastMessage: { $first: "$messages" }
            }
        },
        {
            $lookup: {
                from: "groups",
                localField: "_id",
                foreignField: "chatId",
                as: "group"
            }
        },
        {
            $addFields: {
                group: { $first: "$group" } // to flatten group as there will only be one
            }
        },
        {
            $addFields: {
                otherUser: {
                    $cond: [
                        { $not: ["$group"] },
                        {
                            $first: {
                                $filter: {
                                    input: "$members",
                                    as: "member",
                                    cond: { $ne: ["$$member", userId] }
                                }
                            }
                        },
                        "$$REMOVE"
                    ]
                }
            }
        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "members",
                as: "members",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            profilePicture: 1,
                            about: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "otherUser",
                as: "otherUser"
            }
        },
        {
            $addFields: {
                otherUser: { $first: "$otherUser" }
            }
        },
        {
            $addFields: {
                name: {
                    $cond: [
                        { $ifNull: ["$group", false] },
                        "$group.name",
                        "$otherUser.name"
                    ]
                },
                avatar: {
                    $cond: [
                        { $ifNull: ["$group", false] },
                        "$group.picture",
                        "$otherUser.profilePicture"
                    ]
                },
                unseenMessagesCount: {
                    $size: {
                        $filter: {
                            input: "$messages.receipt",
                            as: "receipt",
                            cond: {
                                $and: [
                                    { $eq: ["$$receipt.userId", userId] },
                                    { $ne: ["$$receipt.status", "seen"] }
                                ]
                            }
                        }
                    }
                }
            }
        },
        {
            $project: {
                group: 0,
                otherUser: 0,
                messages: 0
            }
        }
    ]);
    return res.status(200).send((0, utils_1.response)(chats, "Chats retrieved"));
}
