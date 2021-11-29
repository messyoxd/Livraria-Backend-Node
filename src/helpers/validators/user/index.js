const path = require("path");
const emailValidation = require(path.join(__dirname, "emailValidation.js"));
const passwordValidation = require(path.join(__dirname, "passwordValidation.js"));
const editPasswordValidation = require(path.join(__dirname, "editPasswordValidation.js"));

module.exports = {
    emailValidation: emailValidation,
    passwordValidation: passwordValidation,
    editPasswordValidation: editPasswordValidation
}