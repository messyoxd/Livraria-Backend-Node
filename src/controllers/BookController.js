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
        return res.status(200).json(book)
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
            res.status(200).json({ message: "Book successfully created!" });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message:
                    "An Error ocurred at the server when creating a new Book!",
            });
        }
    }
};
