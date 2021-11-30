const path = require("path");
const UserDto = require(path.join(__dirname, "UserDto.js"));
const BookDto = require(path.join(__dirname, "BookDto.js"));
module.exports = class BookRentDto {
    static toDto(bookRent, user, book, publisher) {
        return {
            id: bookRent.id,
            user: user != undefined ? UserDto.toDto(user) : undefined,
            book:
                user != undefined ? BookDto.toDto(book, publisher) : undefined,
            devolutionEstimate: bookRent.devolutionEstimate,
            devolutionDate: bookRent.devolutionDate,
            rentStatus: bookRent.rentStatus,
            createdAt: bookRent.createdAt,
            updateAt: bookRent.updateAt,
        };
    }
};
