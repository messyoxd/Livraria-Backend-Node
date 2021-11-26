const path = require("path");
const basicValidation = require(path.join(__dirname, "..", "basicValidation.js"));
module.exports = function (value) {
  return basicValidation(value)
    .bail()
    .isEmail()
    .withMessage("Must be a valid address!");
};
