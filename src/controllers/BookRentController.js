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
    static async deleteBookRent(req, res) {
        const id = req.params.id;

        const bookRent = await BookRent.findOne({
            raw: true,
            where: { id: id },
        });
        if (!bookRent)
            return res.status(422).json({
                message: `Book Rent not found!`,
            });
        try {
            await BookRent.destroy({ where: { id: id } });
            return res
                .status(200)
                .json({ message: "Book Rent successfully deleted!" });
        } catch (error) {
            return res.status(500).json({
                message:
                    "An Error ocurred at the server when deleting book rent!",
            });
        }
    }

    static async returnBook(req, res) {
        const id = req.params.id;
        const bookRent = await BookRent.findOne({
            raw: true,
            where: { id: id },
        });
        if (!bookRent)
            return res.status(422).json({
                message: `Book Rent not found!`,
            });
        bookRent.devolutionDate = new Date();
        if (
            bookRent.devolutionDate <
            new Date(Date.parse(bookRent.devolutionEstimate))
        ) {
            bookRent.rentStatus = 3;
        } else {
            bookRent.rentStatus = 2;
        }
        try {
            // increment the book stock by 1
            await BookRentController.alterBookStock(id);
        } catch (error) {
            console.log(error);
            return res.status(422).json({
                message: error,
            });
        }
        await BookRent.update(bookRent, { where: { id: id } });
        return res.status(200).json({ message: "Book returned successfully!" });
    }

    static async getBookRentByUserAndBookIds(req, res) {
        // validations

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { page, size } = req.query;
        const pageNumber = Number.parseInt(page);
        const sizeNumber = Number.parseInt(size);

        if (sizeNumber > 20)
            return res
                .status(422)
                .json({ message: "Can only get as much as 20 entries!" });

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

        const bookRentsQuery = await BookRent.findAndCountAll({
            limit: sizeNumber,
            offset: pageNumber * sizeNumber,
            where: { BookId: bookId, UserId: userId },
        });
        const bookRents = bookRentsQuery["rows"];
        return res
            .status(200)
            .json(await BookRentController.getBookRentDtoList(bookRents));
    }

    static async getAllBookRents(req, res) {
        // validations

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { page, size } = req.query;
        const pageNumber = Number.parseInt(page);
        const sizeNumber = Number.parseInt(size);

        if (sizeNumber > 20)
            return res
                .status(422)
                .json({ message: "Can only get as much as 20 entries!" });

        const bookId = req.params.bookId;
        const book = await Book.findOne({ raw: true, where: { id: bookId } });
        if (!book)
            return res.status(422).json({
                message: `Book not found!`,
            });
        const bookRentsQuery = await BookRent.findAndCountAll({
            limit: sizeNumber,
            offset: pageNumber * sizeNumber,
            where: { BookId: bookId },
        });
        const bookRents = bookRentsQuery["rows"];
        return res
            .status(200)
            .json(await BookRentController.getBookRentDtoList(bookRents));
    }

    static async getAllUserRents(req, res) {
        const userId = req.params.userId;
        // validations

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { page, size } = req.query;
        const pageNumber = Number.parseInt(page);
        const sizeNumber = Number.parseInt(size);

        if (sizeNumber > 20)
            return res
                .status(422)
                .json({ message: "Can only get as much as 20 entries!" });

        const user = await User.findOne({ raw: true, where: { id: userId } });
        if (!user)
            return res.status(422).json({
                message: `User not found!`,
            });
        const userRentsQuery = await BookRent.findAndCountAll({
            limit: sizeNumber,
            offset: pageNumber * sizeNumber,
            where: { UserId: userId },
        });
        const userRents = userRentsQuery["rows"];
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

    static async getAllRents(req, res) {
        // validations

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { page, size } = req.query;
        const pageNumber = Number.parseInt(page);
        const sizeNumber = Number.parseInt(size);

        if (sizeNumber > 20)
            return res
                .status(422)
                .json({ message: "Can only get as much as 20 entries!" });

        const bookRentsQuery = await BookRent.findAndCountAll({
            limit: sizeNumber,
            offset: pageNumber * sizeNumber,
        });
        const bookRents = bookRentsQuery["rows"];
        return res
            .status(200)
            .json(await BookRentController.getBookRentDtoList(bookRents));
    }

    static async alterBookStock(bookId, value = 1, increment = true) {
        try {
            const book = await Book.findOne({
                raw: true,
                where: { id: bookId },
            });

            if (!book) throw new Error(`Book not found!`);

            if (increment) book.availableStock = book.availableStock + value;
            else {
                if (book.availableStock > 0)
                    book.availableStock = book.availableStock - value;
                else {
                    throw new Error(`Book not available!`);
                }
            }
            await Book.update(book, { where: { id: book.id } });
        } catch (error) {
            return error;
        }
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

        try {
            // decrement the book stock by 1
            await BookRentController.alterBookStock(bookId, 1, false);
        } catch (error) {
            return res.status(422).json({
                message: error,
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
