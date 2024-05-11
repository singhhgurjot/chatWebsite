const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
const ChatSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  name: { type: String, required: true },
  lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
});

// Create the models
const MessageModel = mongoose.model("Message", MessageSchema);
const ChatModel = mongoose.model("Chat", ChatSchema);

module.exports = {
  MessageModel,
  ChatModel,
};
