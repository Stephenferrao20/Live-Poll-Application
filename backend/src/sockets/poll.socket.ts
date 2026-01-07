const { Server } = require("socket.io");
const PollService = require("../services/poll.service");
const UserSession = require("../models/UserSession");
const ChatMessage = require("../models/ChatMessage");


module.exports = function pollSocket(io) {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

   
    socket.on("get_active_poll", async () => {
      try {
        const poll = await PollService.getActivePoll();

        if (!poll) {
          socket.emit("poll_state", { poll: null });
          return;
        }

        const remainingTime = PollService.getRemainingTime(poll);

        socket.emit("poll_state", {
          poll,
          remainingTime,
        });
      } catch (err: any) {
        socket.emit("error", err.message);
      }
    });

   
    socket.on("create_poll", async (data) => {
  try {
    const activePoll = await PollService.getActivePoll();
    if (activePoll) {
      throw new Error("Another poll is already active");
    }

    const poll = await PollService.createPoll(data);

    io.emit("poll_started", {
      poll,
      remainingTime: poll.duration,
    });

    const interval = setInterval(async () => {
      const ended = await PollService.checkAndEndPoll(io, poll._id);
      if (ended) clearInterval(interval);
    }, 1000);
  } catch (err: any) {
    socket.emit("error", err.message);
  }
});


   
    socket.on("submit_vote", async (data) => {
      try {
        await PollService.submitVote(data);

        const poll = await PollService.getActivePoll();
        io.emit("poll_update", poll);
      } catch (err: any) {
        socket.emit("error", err.message);
      }
    });

    socket.on("user_join", async ({ name, role }) => {
    try {
    // Delete any existing session for this socketId first
    await UserSession.deleteOne({ socketId: socket.id });
    
    // Delete all old sessions for the same name/role to prevent duplicates from page refreshes
    await UserSession.deleteMany({ name, role });
    
    // Create new session
    await UserSession.create({
      socketId: socket.id,
      name,
      role,
    });

    const users = await UserSession.find().lean();
    io.emit("participants:update", users);
    } catch (err) {
    console.error(err);
    }
  });
  
  socket.on("kick_user", async (socketId: string) => {
  await UserSession.deleteOne({ socketId });
  io.to(socketId).disconnectSockets(true);

  const users = await UserSession.find().lean();
  io.emit("participants:update", users);
  });


    // Send message
socket.on("chat:send", async ({ message }) => {
  const session = await UserSession.findOne({ socketId: socket.id });
  if (!session) return;

  const chat = await ChatMessage.create({
    name: session.name,
    role: session.role,
    message,
  });

  io.emit("chat:new", chat);
});

// Load chat history
socket.on("chat:history", async () => {
  const history = await ChatMessage.find()
    .sort({ createdAt: 1 })
    .limit(50)
    .lean();

  socket.emit("chat:history", history);
});


    socket.on("disconnect", async () => {
    await UserSession.deleteOne({ socketId: socket.id });

    const users = await UserSession.find().lean();
    io.emit("participants:update", users);

    console.log("Client disconnected:", socket.id);
    });
  });
}
