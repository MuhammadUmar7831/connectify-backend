import { Socket, Server } from "socket.io";
import { updateNotReceivedMessages, updateUnseenMessages } from "./message";

export const activeUsers = new Map<string, string>();
export default function socketHandler(io: Server, socket: Socket) {

  // whenever someone connect he must emit this so backend can keep record of him
  socket.on("active", async ({ userId }) => {
    activeUsers.set(socket.id, userId);
    console.log(activeUsers)
    await updateNotReceivedMessages({ userId })
    io.emit('userJoined', userId)
    console.log(`✅ User ${userId} is active with socket ${socket.id}`);
  });

  // Join a specific chat
  socket.on("joinRoom", async ({ chatId, userId }) => {
    socket.join(chatId);
    await updateUnseenMessages({ chatId, userId })
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