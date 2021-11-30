const path = require("path");
const UserController = require(path.join(__dirname, "UserController.js"));
const PublisherController = require(path.join(
    __dirname,
    "PublisherController.js"
));
const BookController = require(path.join(__dirname, "BookController.js"));
const BookRentController = require(path.join(
    __dirname,
    "BookRentController.js"
));
module.exports = {
    UserController: UserController,
    PublisherController: PublisherController,
    BookController: BookController,
    BookRentController: BookRentController,
};
