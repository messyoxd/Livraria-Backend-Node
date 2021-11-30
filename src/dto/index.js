const path = require("path");
const UserDto = require(path.join(__dirname, "UserDto.js"));
const BookRentDto = require(path.join(__dirname, "BookRentDto.js"));
const BookDto = require(path.join(__dirname, "BookDto.js"));

module.exports = {
    UserDto: UserDto,
    BookDto: BookDto,
    BookRentDto: BookRentDto,
};
