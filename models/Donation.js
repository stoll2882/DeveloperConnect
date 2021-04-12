const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
//   transactionId: {
//     type: String,
//     unique: true,
//   },
  amount: {
    type: String,
    required: true,
  },
});

module.exports = Donation = mongoose.model('donation', DonationSchema);