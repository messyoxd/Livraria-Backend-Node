const express = require("express");
const router = express.Router();
const path = require("path");
const { route } = require("./PublisherRoutes");
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

const { basicValidation, editBasicValidation } = require(path.join(
    __dirname,
    "..",
    "helpers",
    "validators",
    "index.js"
));

const { stockValidation, dateValidation } = require(path.join(
    __dirname,
    "..",
    "helpers",
    "validators",
    "book",
    "index.js"
));

// routes

// create Book

router.post(
    "/create",
    verifyToken,
    basicValidation("publisherId", 1),
    basicValidation("author"),
    basicValidation("title"),
    dateValidation("publishedDate"),
    stockValidation("availableStock"),
    BookController.createBook
);

module.exports = router;
