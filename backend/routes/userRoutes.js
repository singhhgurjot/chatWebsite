const express = require("express");
const router = express.Router();
const { User } = require("../models/userModel");

const userController = require("../controllers/userController");
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/sendRequest", userController.sendFriendRequest);
router.post("/acceptRequest", userController.acceptFriendRequest);
router.get("/getFriends/:userId", userController.getAllFriends);
router.get("/changeStatus", userController.changeStatus);
router.get("/searchUser", userController.searchUser);
router.get("/socket", (req, res) => {
  const io = req.app.get("io");
  userController.socket(req, res, io);
});

module.exports = router;
