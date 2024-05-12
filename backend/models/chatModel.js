const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
const ChatSchema = mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  name: { type: String, required: true },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
});

const ChatModel = mongoose.model("Chat", ChatSchema);

module.exports = ChatModel;
