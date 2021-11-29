const { check } = require("express-validator");
module.exports = function (value, min = 0) {
    return check(value)
        .exists()
        .withMessage(`Field ${value} is required!`)
        .bail()
        .not()
        .isEmpty()
        .withMessage("Must not be blank!")
        .bail()
        .isInt()
        .withMessage(`Must be a Integer!`)
        .bail()
        .custom((value, { req }) => {
            if (value < min) throw new Error(`Must be bigger than ${min}!`);
            return true;
        });
};
