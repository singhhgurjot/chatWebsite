const { configDotenv } = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const app = express();
app.use(express.json());
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
app.use(userRoutes);
app.listen(port, (req, res) => {
  console.log(`Server is running on port ${port}`);
});
