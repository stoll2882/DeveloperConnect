const mongoose = require('mongoose');

const FacebookUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fbid: {
    type: String,
    required: true,
  },
});

module.exports = FacebookUser = mongoose.model(
  'facebookuser',
  FacebookUserSchema
);
