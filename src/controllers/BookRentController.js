const path = require("path");

// model
const { Book, User, BookRent } = require(path.join(
    __dirname,
    "..",
    "models",
    "index.js"
));

// field validation
const { validationResult } = require("express-validator");

module.exports = class BookRentController {
    static async createBookRent(req, res) {
        // validations

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            userId,
            bookId,
            rentStatus,
        } = req.body;

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
        }
        // create book rent
        const estimate = new Date()
        console.log(estimate.toLocaleDateString());
        estimate.setHours(2*24)
        console.log(estimate.toLocaleDateString());
        try {
            await BookRent.create({
                UserId: userId,
                BookId: bookId,
                devolutionEstimate: estimate.toLocaleDateString(), // 2 days from the current date
                rentStatus: rentStatus,
            });
            return res.status(201).json({ message: "Book successfully rented!" });
        } catch (error) {
            return res.status(500).json({
                message: "An Error ocurred at the server when renting a book!",
            });
        }
    }
};
