const jwt = require("jsonwebtoken");
const path = require("path");
const jwtSecret = require(path.join(
  __dirname,
  "..",
  "..",
  "config",
  "jwtSecret.json"
))["secret"];

const createUserToken = async (user, req, res) => {
  // create token
  const token = jwt.sign(
    {
      email: user.email,
      id: user.id,
      // iat: Math.floor(Date.now() / 1000) + (3600 * 12)  // expires in 12h
    },
    jwtSecret
  );

  // return token
  res.status(201).json({
    message: "User authenticated",
    token: token,
  });
};

module.exports = createUserToken;
