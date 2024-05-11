const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
class userController {
  static register = (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    try {
      User.findOne({ email: email }).then((data, err) => {
        if (err) {
          return res.status(500).json({ message: "Internal Server Error" });
        }
        if (data) {
          return res.status(200).json({ message: "Email Already Exists" });
        } else {
          const salt = bcrypt.genSaltSync(10);
          const encryptedPassword = bcrypt.hashSync(password, salt);
          User.create({
            username: username,
            email: email,
            password: encryptedPassword,
          }).then((data, err) => {
            if (err) {
              return res.status(500).json({ message: err });
            }
            if (data) {
              console.log("Registered Successfully", data);
              return res
                .status(200)
                .json({ message: "Registered Successfully" });
            }
          });
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  static login = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    try {
      User.findOne({ email: email }).then((data, err) => {
        if (err) {
          return res.status(500).json({ message: "Internal Server Error" });
        }
        if (data) {
          const compare = bcrypt.compareSync(password, data.password);
          if (compare) {
            const token = jwt.sign(
              { email: email, id: data._id },
              process.env.JWT_SECRET,
              { expiresIn: "24h" }
            );
            return res
              .status(200)
              .json({ message: "Login Successful", token: token });
          } else {
            return res.status(400).json({ message: "Invalid Password" });
          }
        } else {
          return res.status(400).json({ message: "Invalid Email" });
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  static sendFriendRequest = (req, res) => {
    const { currentUserId, recepientUserId } = req.body;
    if (!currentUserId || !recepientUserId) {
      return res.status(500).json({ message: "Invalid User" });
    }
    if (currentUserId === recepientUserId) {
      return res.status(500).json({ message: "Invalid User" });
    }
    User.findByIdAndUpdate(currentUserId, {
      $push: { sentFriendRequests: recepientUserId },
    })
      .then((data, err) => {
        if (data) {
          console.log(data);
        }
        if (err) {
          console.log(err);
        }
      })
      .catch((err) => {
        return res.status(500).json({ message: "Internal Server Error" });
      });
    User.findByIdAndUpdate(recepientUserId, {
      $push: { friendRequests: currentUserId },
    })
      .then((data, err) => {
        if (data) {
          console.log(data);
          return res.status(200).json({ message: "Request Sent Successfully" });
        }
        if (err) {
          console.log(err);
        }
      })
      .catch((err) => {
        return res.status(500).json({ message: "Internal Server Error" });
      });
  };
  static acceptFriendRequest = async (req, res) => {
    try {
      const { currentUserId, recepientUserId } = req.body;
      if (!currentUserId || !recepientUserId) {
        return res.status(400).json({ message: "Invalid User" });
      }

      const currentUser = await User.findOne({ _id: currentUserId });
      const recepientUser = await User.findOne({ _id: recepientUserId });

      if (!currentUser || !recepientUser) {
        return res.status(400).json({ message: "User not found" });
      }

      if (!currentUser.friendRequests.includes(recepientUserId)) {
        console.log("Friend Request Not Found");
        return res.status(400).json({ message: "Friend Request Not Found" });
      }

      if (!recepientUser.sentFriendRequests.includes(currentUserId)) {
        console.log("Friend Request Not Sent");
        return res.status(400).json({ message: "Friend Request Not Sent" });
      }

      await User.findByIdAndUpdate(currentUserId, {
        $pull: { friendRequests: recepientUserId },
        $push: { friends: recepientUserId },
      });

      await User.findByIdAndUpdate(recepientUserId, {
        $pull: { sentFriendRequests: currentUserId },
        $push: { friends: currentUserId },
      });

      return res.status(200).json({ message: "Accepted Successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  static getAllFriends = (req, res) => {
    const userId = req.params.userId;
    User.findById(userId)
      .populate("friends", "username email status")
      .then((data, err) => {
        if (data) {
          console.log(data);
          return res.status(200).json({ friends: data.friends });
        }
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Internal Server Error" });
        }
      });
  };
  static changeStatus = (req, res) => {
    const { userId, status } = req.body;
    if (!userId || !status) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    User.findByIdAndUpdate(userId, { status: status })
      .then((data, err) => {
        if (data) {
          console.log(data);
          return res
            .status(200)
            .json({ message: "Status Changed Successfully" });
        }
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Internal Server Error" });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
      });
  };
}
module.exports = userController;
