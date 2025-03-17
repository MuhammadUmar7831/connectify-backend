import http from "http";
import { Server as SocketServer } from "socket.io";
import app from "./app";


const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: { origin: "*" },
});


io.on("connection", (socket) => {
  console.log(`⚡: User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`❌: User disconnected: ${socket.id}`);
  });
});

export default server