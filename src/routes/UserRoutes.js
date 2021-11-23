const express = require("express");
const router = express.Router();
const path = require("path");
const UserController = require(path.join(
  __dirname,
  "..",
  "controllers",
  "UserController.js"
));
// const { body, check } = require("express-validator");
const {
  basicValidation,
  emailValidation,
  passwordValidation,
} = require(path.join(__dirname, "..", "helpers", "validators"));

// Create User
router.post(
  "/create-user",
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
router.get('/check-user', UserController.checkUser)
// router.post('/get-user', UserController.getUserById)
// router.post('/edit-user', UserController.editUser)
// router.post('/delete-user', UserController.deleteUser)


module.exports = router;
