const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
  text: { type: String, required: true },
  date: { type: Date, required: true },
  userId: { type: String, required: true },
  username: { type: String, required: true },
});

module.exports = mongoose.model('Messages', MessageSchema);