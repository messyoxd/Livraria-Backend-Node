const { check } = require("express-validator");
module.exports = function (value, min = 5, max = 50) {
  return check(value)
    .if((v, { req }) => req.body[value] !== undefined)
    .isLength({ min: min })
    .withMessage(`Must have at least ${min} character(s)!`)
    .bail()
    .isLength({ max: max })
    .withMessage(`Must not have more than ${max} character(s)!`);
};
