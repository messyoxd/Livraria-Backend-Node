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

router.post('/create', PublisherController.createPublisher)

module.exports = router