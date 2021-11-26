const express = require("express");
const router = express.Router();

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

module.exports = router