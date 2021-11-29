const { DataTypes } = require("sequelize");
const path = require("path");
const db = require(path.join(__dirname, "..", "db", "conn.js"));

const Publisher = require(path.join(__dirname, "Publisher.js"));

const Book = db.define("Book", {
    author: {
        type: DataTypes.STRING,
        required: true,
    },
    title: {
        type: DataTypes.STRING,
        required: true,
    },
    publishedDate: {
        type: DataTypes.DATE,
        required: true,
    },
    availableStock: {
        type: DataTypes.INTEGER,
        required: true,
    },
});

Book.belongsTo(Publisher); // Book will have a publisherId attribute in it's table

module.exports = Book;
