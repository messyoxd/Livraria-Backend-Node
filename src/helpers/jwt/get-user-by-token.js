const jwt = require("jsonwebtoken");
const path = require("path");
const { User } = require(path.join(
  __dirname,
  "..",
  "..",
  "models",
  "index.js"
));
const jwtSecret = require(path.join(
  __dirname,
  "..",
  "..",
  "config",
  "jwtSecret.json"
))["secret"];

const getUserByToken = async (token) => {
  const decoded = jwt.verify(token, jwtSecret);

  const userId = decoded.id;

  return await User.findOne({ raw: true, where: { id: userId } });
};

module.exports = getUserByToken;
