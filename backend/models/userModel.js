const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "busy"],
    default: "available",
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  friendRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
  sentFriendRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
