const path = require("path");
const User = require(path.join(__dirname, "User.js"));
const Publisher = require(path.join(__dirname, "Publisher.js"));
const Book = require(path.join(__dirname, "Book.js"));

module.exports = {
    User: User,
    Publisher: Publisher,
    Book: Book,
};
