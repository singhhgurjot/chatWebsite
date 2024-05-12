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
const { VertexAI } = require("@google-cloud/vertexai");
const { Storage } = require("@google-cloud/storage");
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
  allowedHeaders: ["Content-Type"],
});
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
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
  async function getLLMResponse(prompt) {
    return new Promise((resolve) => {
      const timeout = Math.random() * (15000 - 5000) + 5000;
      setTimeout(() => {
        resolve("Yes i am busy right now (Generated from the api) ");
      }, timeout);
    });
  }
  // Example usage
  socket.on("ai message", (chatId) => {
    console.log("Ai message Case", chatId.theirMessage);
    var reply;
    getLLMResponse(chatId.theirMessage.content).then((reply2) => {
      reply = reply2;
    });
    console.log("Reply", reply);
    chatId.theirMessage.content =
      "Yes i am busy right now (Generated from the api) ";
    chatId.theirMessage.sender = chatId.userId;

    chatId.theirMessage.chat.participants.forEach((user) => {
      socket.in(user._id).emit("message received", chatId.theirMessage);
    });
    socket.broadcast.emit("new message");
  });
});
app.use(userRoutes);
app.use(chatRoutes);

server.listen(port, (req, res) => {
  console.log(`Server is running on port ${port}`);
});
