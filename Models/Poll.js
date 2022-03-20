const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  description: String,
  votes: { type: Number, default: 0 },
})

const pollSchema = new mongoose.Schema({
  subject: String,
  author: String,
  password: String,
  expires: Date,
  format: { type: String, default: 'default' },
  options: [optionSchema],
}, {timestamps: true});

module.exports = {
  Poll: mongoose.model('Poll',  pollSchema),
  Option: mongoose.model('Option', optionSchema),
}
