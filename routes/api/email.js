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
// @desc    Send welcome email
// @access  Private
router.post('/welcome', async (req, res) => {
  const { email, name } = req.body;
  var mail = {
    from: SITE_EMAIL,
    to: email,
    subject: 'Welcome to Developer Connect',
    text: `Hi ${name}, \n\nMy name is Sam Toll, and I am one the developer of Developer Connect. I wanted to thank you for joining our site, and personally welcome you to our community. Developer Connect is a platform for developers to be able to share their accomplishments as well as communicate with one another, and I hope you come to enjoy it as much as I do! \n\nFeel free to reach out if you have any questions at all! \n\n Thank you, \n\n Sam Toll \n${SITE_EMAIL}`,
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

const Donation = require('../../models/Donation');

// @route   POST api/textmessage
// @desc    Send payment confirmation email
// @access  Private
router.post('/paymentconfirmation', async (req, res) => {
  const { email, name, date, amount, paymentMethod } = req.body;
  var newDonation = new Donation({
    email,
    name,
    date,
    amount,
    paymentMethod
  })

  const donation = await newDonation.save();
  res.json(donation);

  var mail = {
    from: SITE_EMAIL,
    to: email,
    subject: 'Your Donation Receipt',
    text: `Hi ${name}, \n\nMy name is Sam Toll, and I am the developer of Developer Connect. I wanted to personally thank you for donating to our site! 
      \n\n***** RECEIPT *****
      \nDATE: ${date} 
      \nDESCRIPTION: Donation to DeveloperConnect
      \nPAYMENT METHOD: ${paymentMethod}
      \nAMOUNT: $${amount}.00 USD
      \nTRANSACTION ID: ${donation._id}`,
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
