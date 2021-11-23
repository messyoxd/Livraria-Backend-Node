const path = require("path");
const User = require(path.join(__dirname, "..", "models", "User.js"));
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const createUserToken = require(path.join(__dirname, '..', 'helpers', 'create-user-token.js'))

module.exports = class UserController {
  static async findUserByEmail(email){
      return await User.findOne({ email: email })
  }

  static async createUser(req, res) {
    // validations

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, password } = req.body;

    // Password cryptography
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create User

    try {
      const newUser = await User.create({
          name: name,
          email: email,
          phone: phone,
          password: passwordHash,
          admin: false
      });
      const returnUser = {
        id: newUser["id"],
        email: newUser["email"]
      };
      await createUserToken(returnUser, req, res)
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal error when creating User" });
      return;
    }
  }

};
