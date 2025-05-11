"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeUsers = void 0;
exports.default = socketHandler;
const message_1 = require("./message");
exports.activeUsers = new Map();
function socketHandler(io, socket) {
    // whenever someone connect he must emit this so backend can keep record of him
    socket.on("active", async ({ userId }) => {
        exports.activeUsers.set(socket.id, userId);
        await (0, message_1.updateNotReceivedMessages)({ userId });
        console.log(`✅ User ${userId} is active with socket ${socket.id}`);
    });
    // Join a specific chat
    socket.on("joinRoom", async ({ chatId, userId }) => {
        socket.join(chatId);
        await (0, message_1.updateUnseenMessages)({ chatId, userId });
        console.log(`👥: ${socket.id} joined room ${chatId}`);
    });
    // User typing event
    socket.on("typing", ({ chatId, userId }) => {
        socket.to(chatId).emit("userTyping", { userId });
    });
    // Message sent event
    socket.on("sendMessage", ({ chatId, message }) => {
        socket.to(chatId).emit("newMessage", message);
        console.log(`👥: ${socket.id} sent a message ${message}`);
    });
}
