const path = require("path");

// model
const { Book, Publisher, User, BookRent } = require(path.join(
    __dirname,
    "..",
    "models",
    "index.js"
));

// Dto
const { BookRentDto } = require(path.join(__dirname, "..", "dto", "index.js"));

// field validation
const { validationResult } = require("express-validator");

module.exports = class BookRentController {
    static async getBookRentByUserAndBookIds(req, res) {
        const { bookId, userId } = req.params;
        const book = await Book.findOne({ raw: true, where: { id: bookId } });
        if (!book)
            return res.status(422).json({
                message: `Book not found!`,
            });
        const user = await User.findOne({ raw: true, where: { id: userId } });
        if (!user)
            return res.status(422).json({
                message: `User not found!`,
            });
        const bookRents = await BookRent.findAll({
            raw: true,
            where: { BookId: bookId, UserId: userId },
        });
        return res
            .status(200)
            .json(await BookRentController.getBookRentDtoList(bookRents));
    }
    static async getAllBookRents(req, res) {
        const bookId = req.params.bookId;
        const book = await Book.findOne({ raw: true, where: { id: bookId } });
        if (!book)
            return res.status(422).json({
                message: `Book not found!`,
            });
        const bookRents = await BookRent.findAll({
            raw: true,
            where: { BookId: bookId },
        });
        return res
            .status(200)
            .json(await BookRentController.getBookRentDtoList(bookRents));
    }
    
    static async getAllUserRents(req, res) {
        const userId = req.params.userId;
        const user = await User.findOne({ raw: true, where: { id: userId } });
        if (!user)
            return res.status(422).json({
                message: `User not found!`,
            });
        const userRents = await BookRent.findAll({
            raw: true,
            where: { UserId: userId },
        });
        return res
            .status(200)
            .json(await BookRentController.getBookRentDtoList(userRents));
    }

    static async getBookRentById(req, res) {
        const id = req.params.id;
        const bookRent = await BookRent.findOne({
            raw: true,
            where: { id: id },
        });
        if (!bookRent)
            return res.status(422).json({
                message: `Book Rent not found!`,
            });
        return res
            .status(200)
            .json(await BookRentController.getBookRentDto(bookRent));
    }

    static async getBookRentDto(bookRent) {
        let user = await User.findOne({
            raw: true,
            where: { id: bookRent.UserId },
        });
        if (!user) console.log(`User not found!`);

        let book = await Book.findOne({
            raw: true,
            where: { id: bookRent.BookId },
        });
        if (!book) console.log(`Book not found!`);

        let publisher = await Publisher.findOne({
            raw: true,
            where: { id: book.PublisherId },
        });
        if (!publisher) console.log(`Publisher not found!`);

        return BookRentDto.toDto(bookRent, user, book, publisher);
    }

    static async getBookRentDtoList(bookRentList) {
        let bookRentsDtoList = [];
        for (let i = 0; i < bookRentList.length; i++) {
            bookRentsDtoList.push(
                await BookRentController.getBookRentDto(bookRentList[i])
            );
        }
        return bookRentsDtoList;
    }

    static async getAllBookRents(req, res) {
        const bookRents = await BookRent.findAll({ raw: true });
        return res
            .status(200)
            .json(await BookRentController.getBookRentDtoList(bookRents));
    }

    static async createBookRent(req, res) {
        // validations

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId, bookId, rentStatus } = req.body;

        // find user
        const user = await User.findOne({
            raw: true,
            where: { id: userId },
        });

        if (!user)
            return res.status(422).json({
                message: `User not found!`,
            });

        // find book
        const book = await Book.findOne({
            raw: true,
            where: { id: bookId },
        });

        if (!book)
            return res.status(422).json({
                message: `Book not found!`,
            });

        // check if the book is available
        if (book.availableStock > 0) {
            book.availableStock = book.availableStock - 1;
            await Book.update(book, { where: { id: book.id } });
        } else {
            return res.status(422).json({
                message: `Book not available!`,
            });
        }
        // create book rent
        const estimate = new Date();
        estimate.setHours(2 * 24);
        try {
            await BookRent.create({
                UserId: userId,
                BookId: bookId,
                devolutionEstimate: estimate.toLocaleDateString(), // 2 days from the current date
                rentStatus: rentStatus,
            });
            return res
                .status(201)
                .json({ message: "Book successfully rented!" });
        } catch (error) {
            return res.status(500).json({
                message: "An Error ocurred at the server when renting a book!",
            });
        }
    }
};
