const path = require("path");
const router = require("express").Router();
const users = require(path.join(__dirname, "UserRoutes.js"));
const publishers = require(path.join(__dirname, "PublisherRoutes.js"));

router.get("/", (req, res) =>
  res.status(200).json({ message: "Hello World!" })
);

module.exports = function (app) {
  app.use("/publishers", publishers);
  app.use("/users", users);
  app.use("/", router);
};
