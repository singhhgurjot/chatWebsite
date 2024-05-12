const express = require("express");
const router = express.Router();
const { User } = require("../models/userModel");
const userController = require("../controllers/userController");
const checkAuth = require("../middlewares/checkAuth");
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/sendRequest", checkAuth, userController.sendFriendRequest);
router.post("/acceptRequest", checkAuth, userController.acceptFriendRequest);
router.get("/getFriends/:userId", checkAuth, userController.getAllFriends);
router.post("/changeStatus", checkAuth, userController.changeStatus);
router.get("/searchUser", checkAuth, userController.searchUser);
router.get("/getStatus/:userId", checkAuth, userController.getStatus);
router.get("/socket", (req, res) => {
  const io = req.app.get("io");
  userController.socket(req, res, io);
});

module.exports = router;
