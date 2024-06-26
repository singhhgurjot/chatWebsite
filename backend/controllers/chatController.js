const User = require("../models/userModel");
const MessageModel = require("../models/messageModel.js");
const ChatModel = require("../models/chatModel.js");

class chatController {
  static createChat = (req, res) => {
    const { senderId, receiverId } = req.body;
    if (!senderId || !receiverId) {
      return res.status(400).json({ message: "Please fill in all fields" });
    } else {
      ChatModel.create({
        participants: [senderId, receiverId],
        name: "sender",
      }).then((data, err) => {
        if (err) {
          return res.status(500).json({ message: "Internal Server Error" });
        }
        if (data) {
          return res.status(200).json({ message: "Chat Created", data: data });
        }
      });
    }
  };
  static sendMessage = (req, res) => {
    const { chatId, senderId, content } = req.body;
    if (!chatId || !senderId || !content) {
      return res.status(400).json({ message: "Please fill in all fields" });
    } else {
      MessageModel.create({
        chat: chatId,
        sender: senderId,
        content: content,
      })
        .then(async (data, err) => {
          if (err) {
            return res.status(500).json({ message: "Internal Server Error" });
          }
          if (data) {
            await ChatModel.populate(data, {
              path: "chat",
              populate: { path: "participants", model: "User" },
            });
            return res
              .status(200)
              .json({ message: "Message Sent", data: data });
          }
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ message: "Internal Server Error" });
        });
    }
  };

  static getChat = (req, res) => {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "Please fill in all fields" });
    } else {
      ChatModel.find({ participants: userId })
        .populate("participants", "username email status")
        .populate("lastMessage")
        .then((data, err) => {
          if (err) {
            return res.status(500).json({ message: "Internal Server Error" });
          }
          if (data) {
            return res
              .status(200)
              .json({ message: "Chat Fetched", data: data });
          }
        });
    }
  };
  static getMessages = (req, res) => {
    const { chatId } = req.params;
    console.log("ChatId is", chatId);
    if (!chatId) {
      return res.status(400).json({ message: "Please fill in all fields" });
    } else {
      MessageModel.find({ chat: chatId })
        .populate("sender", "username email")
        .then((data, err) => {
          if (err) {
            return res.status(500).json({ message: "Internal Server Error" });
          }
          if (data) {
            return res
              .status(200)
              .json({ message: "Messages Fetched", data: data });
          }
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ message: "Internal Server Error" });
        });
    }
  };
}
module.exports = chatController;
