const { check } = require("express-validator");
module.exports = function (value, min, max) {
  return check(value)
    .if((value, { req }) => req.body.password !== undefined)
    .isLength({ min: min })
    .withMessage(`Must have at least ${min} character(s)!`)
    .bail()
    .isLength({ max: max })
    .withMessage(`Must not have more than ${max} character(s)!`);
};
