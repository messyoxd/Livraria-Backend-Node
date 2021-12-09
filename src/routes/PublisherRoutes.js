const express = require("express");
const router = express.Router();
const path = require("path");
const { PublisherController } = require(path.join(
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
const { check } = require("express-validator");
const {
    basicValidation,
    editBasicValidation,
    paginationValidation,
} = require(path.join(__dirname, "..", "helpers", "validators", "index.js"));

// routes

// create publisher
router.post(
    "/create",
    verifyToken,
    checkIfUserIsAdmin,
    basicValidation("name"),
    basicValidation("city"),
    PublisherController.createPublisher
);

// get publisher by id
router.get(
    "/:id",
    verifyToken,
    checkIfUserIsAdmin,
    PublisherController.getPublisherByID
);

// get all publishers
router.get(
    "/",
    verifyToken,
    checkIfUserIsAdmin,
    paginationValidation("page"),
    paginationValidation("size"),
    PublisherController.getAllPublishers
);

// edit publish
router.patch(
    "/edit/:id",
    verifyToken,
    checkIfUserIsAdmin,
    editBasicValidation("name", 3),
    editBasicValidation("city", 3),
    PublisherController.editPublisher
);

// delete publish
router.delete(
    "/delete/:id",
    verifyToken,
    checkIfUserIsAdmin,
    PublisherController.deletePublisherById
);

module.exports = router;
