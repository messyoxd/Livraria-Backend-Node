const { DataTypes } = require("sequelize");
const path = require("path");
const db = require(path.join(__dirname, "..", "db", "conn.js"));

const User = require(path.join(__dirname, "User.js"));
const Book = require(path.join(__dirname, "Book.js"));

const BookRent = db.define("BookRent", {
    devolutionEstimate: {
        type: DataTypes.DATE,
        required: true
    },
    devolutionDate: {
        type: DataTypes.DATE,
        required: false
    },
    rentStatus: {
        type: DataTypes.ENUM({
            values: ["Rented", "Returned", "Returned Late"]
        }),
        required: true
    },
})

BookRent.belongsTo(User)
BookRent.belongsTo(Book)

module.exports = BookRent