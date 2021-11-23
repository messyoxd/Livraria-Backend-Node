const express = require("express");
const router = express.Router();
const path = require("path");
const UserController = require(path.join(
  __dirname,
  "..",
  "controllers",
  "UserController.js"
));
const { body, check } = require("express-validator");

// CRUD
router.post(
  "/create-user",
  check("name")
    .exists()
    .withMessage("Field name is required!")
    .bail()
    .not()
    .isEmpty()
    .withMessage("Must not be blank!"),

  check("email")
    .exists()
    .withMessage("Field email is required!")
    .bail()
    .not()
    .isEmpty()
    .withMessage("Must not be blank!")
    .bail()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be a valid address!")
    .bail()
    .custom(async (value) => {
      const user = await UserController.findUserByEmail(value);
      if (user === null) {
        return true;
      } else {
        throw new Error("Email already registered!");
      }
    }),

  check("phone")
    .exists()
    .withMessage("Field phone is required!")
    .bail()
    .not()
    .isEmpty()
    .withMessage("Must not be blank!"),

  check("password")
    .exists()
    .withMessage("Field password is required!")
    .bail()
    .not()
    .isEmpty()
    .withMessage("Must not be blank!")
    .bail()
    .isLength({ min: 5 })
    .withMessage("Must have at least 5 characters!")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Must not have more than 50 characters!"),

  check("confirmpassword")
    .exists()
    .withMessage("Field confirmpassword is required!")
    .bail()
    .not()
    .isEmpty()
    .withMessage("Must not be blank!")
    .bail()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Must match with field password!"),

  UserController.createUser
);
// router.post('/get-user', UserController.getUserById)
// router.post('/edit-user', UserController.editUser)
// router.post('/delete-user', UserController.deleteUser)

module.exports = router;
