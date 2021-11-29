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
    uintValidation
} = require(path.join(__dirname, "..", "helpers", "validators", "index.js"));

// routes

router.post(
    "/rent",
    verifyToken,
    basicValidation("userId", 1),
    basicValidation("bookId", 1),
    uintValidation("rentStatus", 1, 4),
    BookRentController.createBookRent
);

module.exports = router;
