const path = require("path");
const basicValidation = require(path.join(__dirname, "..", "basicValidation.js"));
module.exports = function (value, min, max) {
  return basicValidation(value, min, max); //lacks password regex for a strong password
};
