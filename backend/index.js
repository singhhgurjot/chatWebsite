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
// io.on("connection", (socket) => {
//   console.log(`A user connected,${socket.id}`);
//   socket.on("sendMessage", (data) => {
//     console.log(data);
//     chatController.sendMessage(io);
//   });
//   socket.on("setup", (userData) => {
//     socket.join(userData._id);
//     console.log(userData._id);
//     socket.emit("connected", socket.id);
//   });
// });
app.use(userRoutes);
app.use(chatRoutes);

server.listen(port, (req, res) => {
  console.log(`Server is running on port ${port}`);
});
