const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const { Storage } = require('@google-cloud/storage');

const GOOGLE_KEY = config.get('images.key');
const GOOGLE_SECRET = config.get('images.secret');

// @route    GET api/image
// @desc     Get user by token
// @access   Private
router.get('/', auth, async (req, res) => {
  const url = await gcsSignedUrl(req.user.id, 360);
  res.send(url);
  console.log(url);
  //   try {
  //     const user = await User.findById(req.user.id).select('avatar');
  //     res.json(user);
  //   } catch (err) {
  //     console.error(err.message);
  //     // res.status(500).send('Server Error');
  //   }
});

// @route    POST api/image
// @desc     Get user by token
// @access   Private
router.post('/', auth, async (req, res) => {
  try {
    // const user = await User.findById(req.user.id).select('avatar');
    await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        $set: {
          avatar: `https://storage.googleapis.com/developerconnect/${req.user.id}`,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(200);
  } catch (err) {
    console.error(err.message);
    // res.status(500).send('Server Error');
  }
});

async function gcsSignedUrl(filename, minutesToExpiration) {
  const bucketName = 'developerconnect';

  const storage = new Storage({ keyFilename: 'google.json' });
  const options = {
    version: 'v4',
    action: 'write',
    expires: Date.now() + minutesToExpiration * 60 * 1000,
  };
  var key = GOOGLE_KEY;
  var secret = GOOGLE_SECRET;
  const [url] = await storage
    .bucket(bucketName)
    .file(filename)
    .getSignedUrl(options);
  return url;
}

module.exports = router;
