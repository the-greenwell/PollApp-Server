const mongoose = require('mongoose');

const voterSchema = new mongoose.Schema({
  poll: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll',
  },
  ipAddress: String,
})

module.exports = Voter = mongoose.model('Voter', voterSchema);
