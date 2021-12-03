const express = require("express");
const router = express.Router();
const path = require("path");
const { BookRentController } = require(path.join(
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
    paginationValidation
} = require(path.join(__dirname, "..", "helpers", "validators", "index.js"));

// routes

// rent a book
router.post(
    "/rent",
    verifyToken,
    basicValidation("userId", 1),
    basicValidation("bookId", 1),
    uintValidation("rentStatus", 1, 4),
    BookRentController.createBookRent
);

// get all book rents
router.get(
    "/rent/",
    verifyToken,
    paginationValidation("page"),
    paginationValidation("size"),
    BookRentController.getAllRents
);

// get a book rent by id
router.get(
    "/rent/:id",
    verifyToken,
    BookRentController.getBookRentById
);

// get all book rents from user
router.get(
    "/rent/user/:userId",
    verifyToken,
    paginationValidation("page"),
    paginationValidation("size"),
    BookRentController.getAllUserRents
);

// get all book rents from book
router.get(
    "/rent/book/:bookId",
    verifyToken,
    paginationValidation("page"),
    paginationValidation("size"),
    BookRentController.getAllBookRents
);

// get book rent from user and book
router.get(
    "/rent/user/:userId/book/:bookId",
    verifyToken,
    paginationValidation("page"),
    paginationValidation("size"),
    BookRentController.getBookRentByUserAndBookIds
);

// return book
router.patch(
    "/rent/:id",
    verifyToken,
    BookRentController.returnBook
);

// delete book rent
router.delete(
    "/rent/:id",
    verifyToken,
    BookRentController.deleteBookRent
)

module.exports = router;
