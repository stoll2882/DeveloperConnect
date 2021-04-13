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

// @route   GET api/donations/:transactionId
// @desc    Get transaction by transactionId
// @access  Public
router.get('/:transactionId', async (req, res) => {
    try {
      const donation = await Donation.findOne({
        _id: req.params.transactionId,
      });
  
      if (!donation) return res.status(400).json({ msg: 'Transaction not found' });
    //   return donation;
      res.json(donation).end();
    } catch (err) {
      console.error(err.message);
      if (err.kind == 'ObjectId') {
        return res.status(400).json({ msg: 'Transaction not found' });
      }
      res.status(500).send('Server error');
    }
});

module.exports = router;