const path = require("path");
const stockValidation = require(path.join(__dirname, "stockValidation.js"));
const dateValidation = require(path.join(__dirname, "dateValidation.js"));
const editStockValidation = require(path.join(
    __dirname,
    "editStockValidation.js"
));
const editDateValidation = require(path.join(
    __dirname,
    "editDateValidation.js"
));

module.exports = {
    stockValidation: stockValidation,
    dateValidation: dateValidation,
    editStockValidation: editStockValidation,
    editDateValidation: editDateValidation,
};
