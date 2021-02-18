const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const normalize = require('normalize-url');
const accountSid = config.get('twilio.sid');
const authToken = config.get('twilio.token');
const client = require('twilio')(accountSid, authToken);

// @route   POST api/textmessage
// @desc    Get current users profile
// @access  Private
router.post('/', async (req, res) => {
  const { name, phoneNumber, message } = req.body;
  client.messages
    .create({
      body: `Thank you for contacting us ${name}. We will get back to you shortly!`,
      from: config.get('twilio.from'),
      to: `+${phoneNumber}`,
    })
    .then((message) => console.log(message.sid));
  client.messages
    .create({
      body: `From: ${phoneNumber} - ${message}`,
      from: config.get('twilio.from'),
      to: config.get('contactMe.sms'),
    })
    .then((message) => console.log(message.sid));
});

module.exports = router;

// @route   POST api/textmessage/twofactorauth
// @desc    Get current users profile
// @access  Private
router.post('/twofactorauth', async (req, res) => {
  // const { code } = req.body;
  // client.messages
  //   .create({
  //     body: `Your DevConnect verification code is ${code}`,
  //     from: '+14694053235',
  //     to: `+${phoneNumber}`,
  //   })
  //   .then((message) => console.log(message.sid));
});

module.exports = router;
