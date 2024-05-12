const { configDotenv } = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const app = express();
const server = createServer(app);
const chatRoutes = require("./routes/chatRoutes");
const chatController = require("./controllers/chatController");
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
  allowedHeaders: ["Content-Type"],
});
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
configDotenv();
const port = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });
io.on("connection", (socket) => {
  console.log(`A user connected,${socket.id}`);
  socket.on("setup", (userData) => {
    socket.join(userData);
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("A user joined room", room);
  });
  socket.on("new message", (newMessage) => {
    console.log("Sender is", newMessage.sender);
    var chat = newMessage.chat;
    console.log("Chat", chat.participants);
    chat.participants.forEach((user) => {
      if (user._id == newMessage.sender) return;
      socket.in(user._id).emit("message received", newMessage);
    });
    socket.broadcast.emit("new message");
  });
  socket.on("ai message", (chatId) => {
    console.log("Ai message Case", chatId.theirMessage);

    chatId.theirMessage.content = "This is the ai response brother";
    chatId.theirMessage.sender = chatId.userId;
    // chatId.theirMessage.participants.forEach((user) => {
    //   if (user._id == chatId.theirMessage.sender) return;
    //   socket.in(user._id).emit("message received", chatId.theirMessage);
    // });
    // socket.broadcast.emit("new message");
  });
});
app.use(userRoutes);
app.use(chatRoutes);

server.listen(port, (req, res) => {
  console.log(`Server is running on port ${port}`);
});
