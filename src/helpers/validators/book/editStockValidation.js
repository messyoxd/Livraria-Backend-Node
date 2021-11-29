const { check } = require("express-validator");
module.exports = function (value, min = 0) {
    return check(value)
        .if((v, { req }) => req.body[value] !== undefined)
        .isInt()
        .withMessage(`Must be a Integer!`)
        .bail()
        .custom((value, { req }) => {
            if (value < min) throw new Error(`Must be bigger than ${min}!`);
            return true;
        });
};
