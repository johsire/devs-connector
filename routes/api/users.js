const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const { check, validationResult } = require('express-validator/check');

// Bring in our User Model
const User = require('../../models/User');

// @route  POST api/user
// @desc   Register user
// @access Public

// Validate the input & report any errors before creating the user
router.post('/', [
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('email', 'Please include a valid email address')
        .isEmail(),
    check('password', 'Please enter a password with 6 characters')
        .isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try{
    // Check if user exist- send back and error if they do
        let user = await User.findOne({ email: email });

        if(user) {
            res.status(400).json({ errors: [ { msg: 'User already exists' } ] });
        }

    // Get users gravatar
    const avatar = gravatar

    // Encrypt the password using bcrypt

    // Return the jsonwebtoken- this will enable the user to login right away when they register in the frontend

    res.send('User route');
    } catch(err) {
        console.log(error.message);
        res.status(500).send('This is a Server error');
    }
});

module.exports = router;
