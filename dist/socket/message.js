"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUnseenMessages = updateUnseenMessages;
exports.updateNotReceivedMessages = updateNotReceivedMessages;
const models_1 = require("../models");
async function updateUnseenMessages({ chatId, userId }) {
    try {
        await models_1.Message.updateMany({
            chatId,
            "receipt.userId": userId,
            "receipt.status": { $ne: "seen" },
        }, {
            $set: { "receipt.$[elem].status": "seen" },
        }, {
            arrayFilters: [{ "elem.userId": userId, "elem.status": { $ne: "seen" } }],
        });
        return true;
    }
    catch (error) {
        console.error("❌ Failed to update unseen messages", error);
        return false;
    }
}
async function updateNotReceivedMessages({ userId }) {
    try {
        await models_1.Message.updateMany({
            "receipt": {
                $elemMatch: {
                    userId,
                    status: "sent",
                },
            },
        }, {
            $set: {
                "receipt.$[elem].status": "received",
            },
        }, {
            arrayFilters: [
                {
                    "elem.userId": userId,
                    "elem.status": "sent", // Only update if status is still "sent"
                },
            ],
        });
        return true;
    }
    catch (error) {
        console.error("❌ Failed to update not received messages", error);
        return false;
    }
}
