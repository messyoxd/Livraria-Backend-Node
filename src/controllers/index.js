const path = require("path");
const UserController = require(path.join(__dirname, "UserController.js"));
const PublisherController = require(path.join(__dirname, "PublisherController.js"));

module.exports = {
  UserController: UserController,
  PublisherController: PublisherController,
};
