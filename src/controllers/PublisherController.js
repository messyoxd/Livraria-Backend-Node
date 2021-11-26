const path = require("path");

// model
const { Publisher } = require(path.join(__dirname, "..", "models", "index.js"));

// field validation
const { validationResult } = require("express-validator");

module.exports = class PublisherController {
  static async createPublisher(req, res) {
    // validations

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, city } = req.body;

    await Publisher.create({ name: name, city: city });

    res.status(200).json({ message: "Publisher created successfully!" });
  }
};
