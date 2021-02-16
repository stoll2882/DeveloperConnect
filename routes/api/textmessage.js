const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const normalize = require('normalize-url');
const accountSid = 'ACb8a54de76e88ea636ad7a6b40405f05b';
const authToken = 'f348fb2b6e0f8f464c1d0c24b294c425';
const client = require('twilio')(accountSid, authToken);

// @route   POST api/textmessage
// @desc    Get current users profile
// @access  Private
router.post('/', async (req, res) => {
  const { name, phoneNumber, message } = req.body;
  client.messages
    .create({
      body: `Thank you for contacting us ${name}. We will get back to you shortly!`,
      from: '+14694053235',
      to: `+${phoneNumber}`,
    })
    .then((message) => console.log(message.sid));
  client.messages
    .create({
      body: `From: ${phoneNumber} - ${message}`,
      from: '+14694053235',
      to: `+14259854543`,
    })
    .then((message) => console.log(message.sid));
});

module.exports = router;
