const path = require("path");
const UserController = require(path.join(__dirname, "UserController.js"));

module.exports = {
  UserController: UserController,
};
