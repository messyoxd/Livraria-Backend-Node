const path = require("path");
const createUserToken = require(path.join(__dirname, "create-user-token.js"));
const getToken = require(path.join(__dirname, "get-token.js"));
const getUserByToken = require(path.join(__dirname, "get-user-by-token.js"));
const verifyToken = require(path.join(__dirname, "verify-token.js"));

module.exports = {
  createUserToken: createUserToken,
  getToken: getToken,
  getUserByToken: getUserByToken,
  verifyToken: verifyToken,
};
