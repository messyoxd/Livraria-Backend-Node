const path = require("path");

// model
const { Book, Publisher } = require(path.join(
    __dirname,
    "..",
    "models",
    "index.js"
));

// Dto
const { BookDto } = require(path.join(__dirname, "..", "dto", "index.js"));

// field validation
const { validationResult } = require("express-validator");

module.exports = class BookController {
    static async deleteBookById(req, res) {
        const bookId = req.params.id;

        const book = await BookController.findBookById(bookId);
        if (!book)
            return res.status(422).json({
                message: `Book with id '${bookId}' not found!`,
            });
        try {
            await Book.destroy({ where: { id: bookId } });
            return res
                .status(200)
                .json({ message: "Book successfully deleted!" });
        } catch (error) {
            return res.status(500).json({
                message: "An Error ocurred at the server when deleting book!",
            });
        }
    }

    static async editBook(req, res) {
        // validations
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const bookId = req.params.id;

        const book = await BookController.findBookById(bookId);
        if (!book)
            return res.status(422).json({
                message: `Book not found!`,
            });

        if (!Object.keys(req.body).length)
            return res
                .status(400)
                .json({ message: "Nothing was sent to update!" });

        const { publisherId, author, title, publishedDate, availableStock } =
            req.body;

        // find publisher
        const publisher = await Publisher.findOne({
            raw: true,
            where: { id: publisherId },
        });
        console.log(publisher);
        if (!publisher)
            return res.status(422).json({
                message: `Publisher with id '${publisherId}' not found!`,
            });

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
            return res.status(200).json("Book successfully edited!");
        } catch (error) {
            return res.status(500).json({
                message: "An Error ocurred at the server when updating book!",
            });
        }
    }

    static async getAllBooks(req, res) {

        // validations

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {page, size} = req.query
        const pageNumber = Number.parseInt(page)
        const sizeNumber = Number.parseInt(size)

        if(sizeNumber > 20)
            return res.status(422).json({message: "Can only get as much as 20 entries!"})

        const booksQuery = await Book.findAndCountAll({limit: sizeNumber, offset: pageNumber*sizeNumber})
        
        const books = booksQuery['rows']
        // const books = await Book.findAll({ raw: true });

        let bookDtoList = [];
        let publisher;
        for (let index = 0; index < books.length; index++) {
            publisher = await Publisher.findOne({
                raw: true,
                where: { id: books[index].PublisherId },
            });
            bookDtoList.push(BookDto.toDto(books[index], publisher));
        }
        return res.status(200).json(bookDtoList);
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
        const publisher = await Publisher.findOne({
            raw: true,
            where: { id: book.PublisherId },
        });
        return res.status(200).json(BookDto.toDto(book, publisher));
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
        const publisher = await Publisher.findOne({
            raw: true,
            where: { id: publisherId },
        });

        if (!publisher)
            return res.status(422).json({
                message: `Publisher not found!`,
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
            res.status(500).json({
                message:
                    "An Error ocurred at the server when creating a new Book!",
            });
        }
    }
};
