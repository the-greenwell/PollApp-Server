const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  option: String,
  votes: Number
})

const pollSchema = new mongoose.Schema({
  subject: String,
  author: String,
  password: String,
  expires: Date,
  format: String,
  options: [optionSchema]
}, {timestamps: true});

module.exports = Poll = mongoose.model('Poll',  pollSchema);
