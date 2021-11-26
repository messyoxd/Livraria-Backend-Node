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
const { basicValidation, editBasicValidation } = require(path.join(
    __dirname,
    "..",
    "helpers",
    "validators",
    "index.js"
));

// routes

// create publisher
router.post(
    "/create",
    verifyToken,
    basicValidation("name"),
    basicValidation("city"),
    PublisherController.createPublisher
);

// get publisher by id
router.get("/:id", verifyToken, PublisherController.getPublisherByID);

// get all publishers
router.get("/", verifyToken, PublisherController.getAllPublishers);

// edit publish
router.patch(
    "/edit/:id",
    verifyToken,
    editBasicValidation("name", 3),
    editBasicValidation('city', 3),
    PublisherController.editPublisher
);

module.exports = router;
