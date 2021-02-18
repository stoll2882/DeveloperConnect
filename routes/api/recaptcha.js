const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const normalize = require('normalize-url');
require('es6-promise').polyfill();
require('isomorphic-fetch');

const { check, validationResult } = require('express-validator');

const RECAPTCHA_SERVER_KEY = config.get('reCaptcha.serverKey');

// @route   POST api/recaptcha
// @desc    Check if user is human
// @access  Private
router.post('/', async (req, res) => {
  const { value } = req.body;

  try {
    var googleResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: `secret=${RECAPTCHA_SERVER_KEY}&response=${value}`,
      }
    );
    var googleResponseContents = await googleResponse.json();
    console.log(googleResponseContents);
    var isHuman = googleResponseContents.success;
    if (isHuman) {
      res.status(200).end();
    } else {
      res.status(401).send('You are a robot, go away').end();
    }
  } catch (err) {
    console.log('ERROR calling Siteverify ' + err);
    res.status(500).send('Error calling google siteverify API').end();
  }
});

module.exports = router;
