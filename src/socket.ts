import http from "http";
import { Server as SocketServer } from "socket.io";
import app from "./app";
import socketHandler, { activeUsers } from "./socket/index";


const server = http.createServer(app);
export const io = new SocketServer(server, {
  cors: { origin: "*" },
});


io.on("connection", (socket) => {
  console.log(`⚡: User connected: ${socket.id}`);

  socketHandler(io, socket)

  socket.on("disconnect", () => {
    console.log(activeUsers)
    activeUsers.delete(socket.id);
    console.log(`❌: User disconnected: ${socket.id}`);
  });
});

export default server