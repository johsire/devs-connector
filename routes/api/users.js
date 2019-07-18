const express = require("express");

const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const {
  check,
  validationResult
} = require("express-validator/check");

// Bring in our User Model
const User = require("../../models/User");

// @route  POST api/user
// @desc   Register User
// @access Public

// Validate the input & report any errors before creating the user
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email address").isEmail(),
    check("password", "Please enter a password with 6 or more characters").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if user exist- send back and error if they do
      let user = await User.findOne({ email: email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      user = new User({
        name,
        email,
        avatar,
        password
      });

      // Create our Salt to hash our password before we encrypt it & pass 10 rounds
      const salt = await bcrypt.genSalt(10);

      // Encrypt the password using bcrypt
      user.password = await bcrypt.hash(password, salt);

      // Save the new user in the db
      await user.save();

      // Get the payload which includes the user id
      const payload = {
        user: {
          id: user.id
        }
      };

      // Return the jsonwebtoken-
      // this will enable the user to login right away when they register in the frontend
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("This is a Server error");
    }
  }
);

module.exports = router;
