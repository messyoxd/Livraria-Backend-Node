const express = require("express");
const router = express.Router();
const path = require("path");
const { BookController } = require(path.join(
    __dirname,
    "..",
    "controllers",
    "index.js"
));

// middlewares

const { verifyToken } = require(path.join(
    __dirname,
    "..",
    "helpers",
    "jwt",
    "index.js"
));

const { checkIfUserIsAdmin } = require(path.join(
    __dirname,
    "..",
    "helpers",
    "roles",
    "index.js"
));

// validators

const {
    basicValidation,
    editBasicValidation,
    dateValidation,
    editDateValidation,
    uintValidation,
    editUintValidation,
    paginationValidation
} = require(path.join(__dirname, "..", "helpers", "validators", "index.js"));


// routes

// create Book
router.post(
    "/create",
    verifyToken,
    checkIfUserIsAdmin,
    basicValidation("publisherId", 1),
    basicValidation("author"),
    basicValidation("title"),
    dateValidation("publishedDate"),
    uintValidation("availableStock"),
    BookController.createBook
);

// get book by id
router.get("/:id", BookController.getBookById);

// get all books
router.get("/", paginationValidation("page"), paginationValidation("size"), BookController.getAllBooks);

// edit Book
router.patch(
    "/edit/:id",
    verifyToken,
    checkIfUserIsAdmin,
    editBasicValidation("publisherId", 1),
    editBasicValidation("author"),
    editBasicValidation("title"),
    editDateValidation("publishedDate"),
    editUintValidation("availableStock"),
    BookController.editBook
);
// delete book
router.delete("/delete/:id", verifyToken, checkIfUserIsAdmin, BookController.deleteBookById);

module.exports = router;
