const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
const MessageModel = mongoose.model("Message", MessageSchema);
module.exports = MessageModel;
