const express = require("express");
const router = express.Router();
const path = require("path");
const UserController = require(path.join(
  __dirname,
  "..",
  "controllers",
  "UserController.js"
));

// middlewares

const verifyToken = require(path.join(
  __dirname,
  "..",
  "helpers",
  "jwt",
  "verify-token.js"
));

// validators
const { check } = require("express-validator");
const {
  basicValidation,
  emailValidation,
  passwordValidation,
} = require(path.join(__dirname, "..", "helpers", "validators"));

// routes

// Create User
router.post(
  "/register",
  basicValidation("name"),
  emailValidation("email")
    .normalizeEmail()
    .bail()
    .custom(async (value) => {
      const user = await UserController.findUserByEmail(value);
      if (user === null) {
        return true;
      } else {
        throw new Error("Email already registered!");
      }
    }),
  basicValidation("phone"),
  passwordValidation("password", 5, 50),
  basicValidation("confirmpassword")
    .bail()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Must match with field password!"),
  UserController.createUser
);
// login
router.post(
  "/login",
  emailValidation("email")
    .bail()
    .custom(async (value) => {
      const user = await UserController.findUserByEmail(value);
      if (user === null) {
        throw new Error("Account not found!");
      } else {
        return true;
      }
    }),
  basicValidation("password"),
  UserController.login
);
// check user
router.get("/check-user", verifyToken, UserController.checkUser);
// get user by id
router.get("/:id", verifyToken, UserController.getUserById);
// update user
router.patch(
  "/edit/",
  verifyToken,
  basicValidation("name"),
  check("phone"),
  check("email").custom((value, { req }) => {
    console.log(req.body.email);
    if (req.body.email == undefined) return true;
    else return Primise.isEmail().withMessage("Must be a valid address!");
  }),
  check("password").custom((value, { req }) => {
    const min = 5;
    const max = 50;
    if (value != undefined && value != "") {
      if (value.length < min) {
        throw new Error(`Must have at least ${min} character(s)!`);
      } else if (value.length > max) {
        throw new Error(`Must not have more than ${max} character(s)!`);
      }
    } else {
      return true;
    }
  }),
  check("confirmpassword")
    .custom((value, { req }) => {
      if (req.body.password != undefined) {
        if (req.body.password != "") return value === req.body.password;
        else throw new Error("Field confirmpassword is required!");
      } else return true;
    })
    .withMessage("Must match with field password!"),
  UserController.editUser
);
// router.post('/delete-user', UserController.deleteUser)

module.exports = router;
