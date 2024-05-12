const express = require("express");
const jwt = require("jsonwebtoken");
const checkAuthUser = async (req, res, next) => {
  const { authorization } = req.headers;
  let token;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      token = authorization.split(" ")[1];
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      req.body.user = id;
      next();
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: "Unauthorised user", success: false });
    }
  }
  if (!token) {
    res
      .status(401)
      .json({ message: "Unauthorised user no token", success: false });
  }
};
module.exports = checkAuthUser;
