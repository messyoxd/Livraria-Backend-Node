const express = require("express");
const router = express.Router();
const path = require("path");
const { UserController } = require(path.join(
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
  emailValidation,
  passwordValidation,
  editPasswordValidation,
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
  passwordValidation("password"),
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
router.get("/check", verifyToken, UserController.checkUser);
// get user by id
router.get("/:id", verifyToken, UserController.getUserById);
// update user
router.patch(
  "/edit/",
  verifyToken,
  check("email")
    .if(check("email").exists())
    .isEmail()
    .withMessage("Must be a valid address!"),
  editPasswordValidation("password", 5, 50),
  check("confirmpassword")
    .if(check("password").exists())
    .exists()
    .withMessage(`Field confirmpassword is required!`)
    .bail()
    .not()
    .isEmpty()
    .withMessage("Must not be blank!")
    .bail()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Must match with field password!"),
  UserController.editUser
);
router.delete(
  "/delete/:id",
  verifyToken,
  checkIfUserIsAdmin,
  UserController.deleteUserById
);

module.exports = router;
