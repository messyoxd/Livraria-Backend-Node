const path = require("path");

// model
const User = require(path.join(__dirname, "..", "models", "User.js"));

// field validation
const { validationResult } = require("express-validator");

// cryptography
const bcrypt = require("bcrypt");

// jwt
const jwt = require("jsonwebtoken");
const jwtSecret = require(path.join(
  __dirname,
  "..",
  "config",
  "jwtSecret.json"
))["secret"];

// Helpers
const createUserToken = require(path.join(
  __dirname,
  "..",
  "helpers",
  "jwt",
  "create-user-token.js"
));
const getToken = require(path.join(
  __dirname,
  "..",
  "helpers",
  "jwt",
  "get-token.js"
));
const getUserByToken = require(path.join(
  __dirname,
  "..",
  "helpers",
  "jwt",
  "get-user-by-token.js"
));

module.exports = class UserController {
  static async findUserByEmail(email) {
    return await User.findOne({ raw: true, email: email });
  }

  static async findUserById(id) {
    return await User.findOne({ raw: true, where: { id: id } });
  }

  static async deleteUserById(req, res) {
    const id = req.params.id;

    try {
      await User.destroy({ where: { id: id } });
      res.status(200).json({ message: `User '${id}' deleted successfully!` });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async editUser(req, res) {
    // validations

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // get user by the token
    const user = await getUserByToken(getToken(req));

    if (!user) {
      return res.status(422).json({ message: `User not found!` });
    }

    // check if sent email is already registered
    const email = req.body.email;
    if (email != undefined) {
      const userExistsByEmail = findUserByEmail(req.body);
      if (!userExistsByEmail)
        return res.status(422).json({
          message: `User with email "${email}" is already registered!`,
        });
    }

    const { name, phone, password } = req.body;

    let image = "";
    // check if current password is equal to the one in the body
    let checkPassword = false;
    let passwordHash = "";
    if (password != undefined) {
      console.log(password);
      const salt = await bcrypt.genSalt(12);
      passwordHash = await bcrypt.hash(password, salt);
      checkPassword = await bcrypt.compare(password, user.password);
      if (checkPassword)
        return res.status(422).json({
          message: `Field password was sent but has the same value as before!`,
        });
    }

    // create user object with only altered data
    const updatedUser = {
      id: user.id,
      name: name != undefined && name != "" ? name : user.name,
      email:
        email != undefined && email != "" && email !== user.email
          ? email
          : user.email,
      phone:
        phone != undefined && phone != "" && phone !== user.phone
          ? phone
          : user.phone,
      password:
        password != undefined && !checkPassword ? passwordHash : user.password,
    };

    // update user
    await User.update(updatedUser, { where: { id: user.id } });

    return res.status(200).json({ message: "User updated successfully" });
  }

  static async getUserByEmail(req, res) {
    const email = req.params.ema;

    const user = await UserController.findUserByEmail(value);

    if (user != null) {
      res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        admin: user.admin,
      });
    } else {
      res.status(422).json({ message: `User with id "${id}" not found!` });
    }
  }

  static async getUserById(req, res) {
    const id = req.params.id;

    const user = await User.findOne({ raw: true, where: { id: id } });

    if (user != null) {
      res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        admin: user.admin,
      });
    } else {
      res.status(422).json({ message: `User with id '${id}' not found!` });
    }
  }

  static async checkUser(req, res) {
    let currentUser;
    if (req.headers.authorization) {
      const token = getToken(req);
      const decoded = jwt.verify(token, jwtSecret);
      currentUser = await User.findOne({
        raw: true,
        where: { id: decoded.id },
      });
      if(!currentUser)
        return res.status(422).json({message: "User not found!"});
      currentUser.password = undefined;
    } else {
      currentUser = null;
    }
    res.status(200).send(currentUser);
  }

  static async login(req, res) {
    // validations
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    // check password
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      res.status(422).json({
        errors: "Invalid password!",
      });
    } else {
      await createUserToken(user, req, res);
    }
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
        admin: false,
      });
      const returnUser = {
        id: newUser["id"],
        email: newUser["email"],
      };
      await createUserToken(returnUser, req, res);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal error when creating User" });
      return;
    }
  }
};
