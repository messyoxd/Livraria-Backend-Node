const { check } = require("express-validator");
module.exports = function (value, min = 5, max = 50) {
  return check(value)
    .exists()
    .withMessage(`Field ${value} is required!`)
    .bail()
    .not()
    .isEmpty()
    .withMessage("Must not be blank!")
    .bail()
    .isLength({ min: min })
    .withMessage(`Must have at least ${min} character(s)!`)
    .bail()
    .isLength({ max: max })
    .withMessage(`Must not have more than ${max} character(s)!`);
};
