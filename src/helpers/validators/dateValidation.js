const { check } = require("express-validator");
module.exports = function (value) {
    return check(value)
        .exists()
        .withMessage(`Field ${value} is required!`)
        .bail()
        .not()
        .isEmpty()
        .withMessage("Must not be blank!")
        .bail()
        .isDate()
        .withMessage(`Must be a Date!`)
};
