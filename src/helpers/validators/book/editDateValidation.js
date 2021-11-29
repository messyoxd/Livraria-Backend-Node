const { check } = require("express-validator");
module.exports = function (value) {
    return check(value)
        .if((v, { req }) => req.body[value] !== undefined)
        .isDate()
        .withMessage(`Must be a valid Date(YYYY-MM-dd)!`);
};
