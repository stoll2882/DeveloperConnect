const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Donation = require('../../models/Donation');

// @route   GET api/donations
// @desc    Get all donations
// @access  Private
router.get('/', async (req, res) => {
    try {
      const donations = await Donation.find().sort({ date: -1 });
      res.json(donations);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

module.exports = router;