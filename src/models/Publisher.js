const { DataTypes } = require("sequelize");
const path = require("path");
const db = require(path.join(__dirname, "..", "db", "conn.js"));

const Publisher = db.define("Publisher", {
  name: {
    type: DataTypes.STRING,
    required: true,
  },
  city: {
    type: DataTypes.STRING,
    required: true,
  },
});

module.exports = Publisher;
