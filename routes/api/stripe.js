const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const liveKey = config.get('stripe.liveKey');
const stripe = require("stripe")(liveKey);

// @route   POST api/stripe
// @desc    Make stripe payment
// @access  Private
router.post('/', async (req, res) => {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: (amount * 100),
        currency: "usd"
    });
    res.send({
        clientSecret: paymentIntent.client_secret
        // hello
    });
});

module.exports = router;