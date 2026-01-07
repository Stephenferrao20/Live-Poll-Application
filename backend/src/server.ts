require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./config/db");
const pollSocket = require("./sockets/poll.socket");

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

pollSocket(io);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
