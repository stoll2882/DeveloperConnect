const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get('/', auth, async (req, res) => {
  var gotUser = false;
  try {
    const user = await User.findById(req.user.id).select('-password');
    gotUser = true;
    res.json(user);
  } catch (err) {
    console.error(err.message);
    // res.status(500).send('Server Error');
  }
  // if (!gotUser) {
  //   try {
  //     const user = await FacebookUser.findById(req.facebookuser.fbid);
  //     gotUser = true;
  //     res.json(user);
  //   } catch (err) {
  //     console.error(err.message);
  //     res.status(500).send('Server Error');
  //   }
  // }
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/',
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    var gotUser = false;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        gotUser = true;
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        user: {
          id: user._id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }

    // if (!gotUser) {
    //   try {
    //     let user = await FacebookUser.findOne({ email });

    //     if (!user) {
    //       return res
    //         .status(400)
    //         .json({ errors: [{ msg: 'Invalid Credentials' }] });
    //     }

    //     const isMatch = await bcrypt.compare(fbid, user.fbid);

    //     if (!isMatch) {
    //       gotUser = true;
    //       return res
    //         .status(400)
    //         .json({ errors: [{ msg: 'Invalid Credentials' }] });
    //     }

    //     const payload = {
    //       user: {
    //         id: user.fbid,
    //       },
    //     };

    //     jwt.sign(
    //       payload,
    //       config.get('jwtSecret'),
    //       { expiresIn: '5 days' },
    //       (err, token) => {
    //         if (err) throw err;
    //         res.json({ token });
    //       }
    //     );
    //   } catch (err) {
    //     console.error(err.message);
    //     res.status(500).send('Server error');
    //   }
    // }
  }
);

module.exports = router;
