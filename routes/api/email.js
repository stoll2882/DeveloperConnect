const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const normalize = require('normalize-url');
const nodemailer = require('nodemailer');

const SITE_EMAIL = config.get('email.siteEmail');
const EMAIL_PASSWORD = config.get('email.emailPassword');

var transporter = nodemailer.createTransport({
  service: 'Yahoo',
  auth: {
    user: SITE_EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

// @route   POST api/textmessage
// @desc    Get current users profile
// @access  Private
router.post('/welcome', async (req, res) => {
  const { email, name } = req.body;
  var mail = {
    from: SITE_EMAIL,
    to: email,
    subject: 'New Custom Order',
    text: `Hi ${name}, \n\nMy name is Sam Toll, and I am one of the developer of Developer Connect. I wanted to thank you for joining our site, and let you know I am here if I can help with anything. \nDeveloper Connect is a platform for developers to be able to share their accomplishments as well as communicate with one another. \n\nMy email is ${SITE_EMAIL}, and feel free to reach out if you have any questions at all! \n\n Thank you, \n\n Sam Toll`,
  };
  transporter.sendMail(mail, (err, data) => {
    if (err) {
      console.log('failed to send email. Error: ' + err);
      res.json({
        status: 'fail',
      });
    } else {
      console.log('sent email: ' + data.response);
      console.log('envelope: ' + JSON.stringify(data.envelope));
      res.json({
        status: 'success',
      });
    }
  });
});

module.exports = router;
