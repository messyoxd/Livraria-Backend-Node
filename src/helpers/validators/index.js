const path = require("path");
const basicValidation = require(path.join(__dirname, "basicValidation.js"));
const emailValidation = require(path.join(__dirname, "emailValidation.js"));
const passwordValidation = require(path.join(__dirname, "passwordValidation.js"));

module.exports = {
    basicValidation: basicValidation,
    emailValidation: emailValidation,
    passwordValidation: passwordValidation
}