const { configDotenv } = require("dotenv");
const express = require("express");
const app = express();
app.use(express.json());
configDotenv();
const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
  console.log(`Server is running on port ${port}`);
});
