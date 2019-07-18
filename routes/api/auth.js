const express = require("express");

const router = express.Router();
const auth = require("../../middleware/auth");
const config = require("config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator/check");

const User = require("../../models/User");

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  POST api/auth
// @desc   Authenticate User & get Token
// @access Public

// Validate the input & report any errors before login in the user
router.post(
  "/",
  [
    check("email", "Please include a valid email address").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user exist- send back and error if they do
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // Compare if the pws are a match using bcrypt inbuilt method- compare()
      // It take 2 arguments, the plain text pw the user enters & the
      // encrypted pw tht we can get from the user obj that we checked from the db
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

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
