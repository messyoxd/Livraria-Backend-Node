const path = require("path");
const basicValidation = require(path.join(__dirname, "basicValidation.js"));
const editBasicValidation = require(path.join(
    __dirname,
    "editBasicValidation.js"
));
module.exports = {
    basicValidation: basicValidation,
    editBasicValidation: editBasicValidation,
};
