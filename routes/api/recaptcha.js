const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const normalize = require('normalize-url');
require('es6-promise').polyfill();
require('isomorphic-fetch');

const { check, validationResult } = require('express-validator');

const RECAPTCHA_SERVER_KEY = '6Le2z0oaAAAAAB1WymVKZLa6WU34rzXNYpUZ5iJx';

// @route   GET api/recaptcha
// @desc    Check if user is human
// @access  Private
router.post('/', async (req, res) => {
  const humanKey = req.body;
  await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
    body: `secret=${RECAPTCHA_SERVER_KEY}&response=${humanKey}`,
  })
    .then((res) => res.json())
    .then((json) => json.success)
    .catch((err) => {
      throw new Error(`Error in Google Siteverify API. ${err.message}`);
    });

  if (humanKey === null || !isHuman) {
    throw new Error(`YOU ARE NOT A HUMAN.`);
  }

  console.log('SUCCESS!');
});
