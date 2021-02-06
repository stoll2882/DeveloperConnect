const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const FacebookUser = require('../../models/FacebookUser');

// @route   POST api/facebookusers
// @desc    Register a facebook user
// @access  Public

router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('fbid', 'fbid is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, fbid } = req.body;

    try {
      // See if the user exists
      let user = await FacebookUser.findOne({ fbid });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      user = new FacebookUser({
        name,
        email,
        fbid,
      });

      // Encrypt id
      const salt = await bcrypt.genSalt(10);

      user.fbid = await bcrypt.hash(fbid, salt);

      // Place await in front of anything that returns a promise
      await user.save();

      // Return jsonWebToken
      const payload = {
        user: {
          id: user.fbid,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }

    console.log(req.body);
  }
);

module.exports = router;
