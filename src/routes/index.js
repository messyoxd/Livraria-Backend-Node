const path = require("path");
const router = require("express").Router();
const users = require(path.join(__dirname, "UserRoutes.js"));
const publishers = require(path.join(__dirname, "PublisherRoutes.js"));
const books = require(path.join(__dirname, "BookRoutes.js"));
const bookRents = require(path.join(__dirname, "BookRentRoutes.js"));


router.use("/book-rents", bookRents),
router.use("/books", books),
router.use("/publishers", publishers);
router.use("/users", users);

// router.get("/", (req, res) =>
//     res.status(200).json({ message: "Hello World!" })
// );

module.exports = router
