const path = require("path");
const stockValidation = require(path.join(__dirname, "stockValidation.js"));
const dateValidation = require(path.join(__dirname, "dateValidation.js"));

module.exports = {
    stockValidation: stockValidation,
    dateValidation: dateValidation,
};
