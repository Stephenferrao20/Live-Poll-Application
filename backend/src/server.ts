import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app.ts";
import connectDB from "./config/db.ts";
import pollSocket from "./sockets/poll.socket.ts";
dotenv.config();


connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

pollSocket(io);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
