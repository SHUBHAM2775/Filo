const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String }, // For text data
  fileUrl: { type: String }, // For file uploads (optional)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserData', DataSchema); 