const path = require("path");

// model
const { Book, Publisher } = require(path.join(
    __dirname,
    "..",
    "models",
    "index.js"
));

// controller
// const { PublisherController } = require(path.join(__dirname, "index.js"));

// field validation
const { validationResult } = require("express-validator");

module.exports = class BookController {
    static async editBook(req, res) {
        // validations
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const bookId = req.params.id;

        const book = await BookController.findBookById(bookId);
        console.log(book);
        if (!book)
            return res.status(422).json({
                message: `Book with id '${bookId}' not found!`,
            });

        if (!Object.keys(req.body).length)
            return res
                .status(400)
                .json({ message: "Nothing was sent to update!" });

        const { publisherId, author, title, publishedDate, availableStock } =
            req.body;

        const editedBook = {
            PublisherId:
                publisherId !== undefined && publisherId !== book.PublisherId
                    ? publisherId
                    : book.PublisherId,
            author:
                author !== undefined && author !== book.author
                    ? author
                    : book.author,
            title:
                title !== undefined && title !== book.title
                    ? title
                    : book.title,
            publishedDate:
                publishedDate !== undefined &&
                publishedDate !== book.publishedDate
                    ? publishedDate
                    : book.publishedDate,
            availableStock:
                availableStock !== undefined &&
                availableStock !== book.availableStock
                    ? availableStock
                    : book.availableStock,
        };

        try {
            await Book.update(editedBook, { where: { id: bookId } });
            res.status(200).json("Book successfully edited!")
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "An Error ocurred at the server when updating book!",
            });
        }
    }

    static async findBookById(id) {
        return await Book.findOne({ raw: true, where: { id: id } });
    }

    static async getBookById(req, res) {
        const id = req.params.id;

        const book = await BookController.findBookById(id);

        if (!book)
            return res.status(422).json({
                message: `Book with id '${id}' not found!`,
            });
        return res.status(200).json(book);
    }

    static async createBook(req, res) {
        // validations
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { publisherId, author, title, publishedDate, availableStock } =
            req.body;

        // find publisher
        const publisher = Publisher.findOne({
            raw: true,
            where: { id: publisherId },
        });

        if (!publisher)
            return res.status(422).json({
                message: `Publisher with id '${publisherId}' not found!`,
            });

        const newBook = {
            PublisherId: publisherId,
            author: author,
            title: title,
            publishedDate: publishedDate,
            availableStock: availableStock,
        };
        try {
            await Book.create(newBook);
            res.status(201).json({ message: "Book successfully created!" });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message:
                    "An Error ocurred at the server when creating a new Book!",
            });
        }
    }
};
