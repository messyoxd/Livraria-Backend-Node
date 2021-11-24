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
));

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

module.exports = class UserController {
  static async findUserByEmail(email) {
    return await User.findOne({ email: email });
  }

  static async getUserById(req, res){

    const id = req.params.id

    const user = await User.findOne({raw: true, where: {id : id}})

    if(user != null){
      res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        admin: user.admin == 0 ? false : true
      })
    }else{
      res.status(422).json({message: `User with id "${id}" not found!`})
    }


  }

  static async checkUser(req, res) {
    let currentUser;
    if (req.headers.authorization) {
      const token = getToken(req);
      const decoded = jwt.verify(token, jwtSecret["secret"]);
      currentUser = await User.findOne({
        raw: true,
        where: { id: decoded.id },
      });
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
