const { query } = require("express-validator");
const paginationValidation = function (value) {
    return query(value)
        .exists()
        .withMessage(`Parameter ${value} is required!`)
        .bail()
        .isInt()
        .withMessage(`Must be a Integer!`)
};

module.exports = paginationValidation;
