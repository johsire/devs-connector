const express = require('express');
const router = express.Router();

// Validate the input & report any errors before creating the user
const { check, validationResult } = require('express-validator/check');

// @route  POST api/user
// @desc   Register user
// @access Public
router.post('/', [
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('email', 'Please include a valid email address')
        .isEmail(),
    check('password', 'Please enter a password with 6 characters')
        .isLength({ min: 6 })
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    res.send('User route');
});

module.exports = router;
