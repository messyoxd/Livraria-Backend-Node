const { DataTypes } = require("sequelize");
const path = require("path");
const db = require(path.join(__dirname, "..", "db", "conn.js"));

const User = db.define("User", {
  name: {
    type: DataTypes.STRING,
    required: true,
  },
  email: {
    type: DataTypes.STRING,
    required: true,
  },
  image: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
    required: true,
  },
  password: {
    type: DataTypes.STRING,
    required: true,
  },
  admin: {
    type: DataTypes.BOOLEAN,
    required: true,
  },
});

module.exports = User;
