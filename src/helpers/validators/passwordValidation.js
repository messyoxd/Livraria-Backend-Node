const path = require("path");
const basicValidation = require(path.join(__dirname, "basicValidation.js"));
module.exports = function (value, min, max) {
  return basicValidation(value)
    .bail()
    .isLength({ min: min })
    .withMessage(`Must have at least ${min} character(s)!`)
    .bail()
    .isLength({ max: max })
    .withMessage(`Must not have more than ${max} character(s)!`);
};
