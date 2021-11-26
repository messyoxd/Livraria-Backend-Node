const path = require("path");
const checkIfUserIsAdmin = require(path.join(
  __dirname,
  "checkIfUserIsAdmin.js"
));

module.exports = {
  checkIfUserIsAdmin: checkIfUserIsAdmin,
};
