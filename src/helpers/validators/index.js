const path = require("path");
const basicValidation = require(path.join(__dirname, "basicValidation.js"));
const editBasicValidation = require(path.join(
    __dirname,
    "editBasicValidation.js"
));
const dateValidation = require(path.join(__dirname, "dateValidation.js"));
const editDateValidation = require(path.join(
    __dirname,
    "editDateValidation.js"
));
const uintValidation = require(path.join(__dirname, "uintValidation.js"));
const editUintValidation = require(path.join(
    __dirname,
    "editUintValidation.js"
));

module.exports = {
    basicValidation: basicValidation,
    editBasicValidation: editBasicValidation,
    dateValidation: dateValidation,
    editDateValidation: editDateValidation,
    uintValidation: uintValidation,
    editUintValidation: editUintValidation,
};
