const { check } = require("express-validator");
module.exports = function (value, min = 0, max = 9007199254740991) {
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
            if (value > max) throw new Error(`Must be lower than ${max}!`);
            return true;
        });
};
