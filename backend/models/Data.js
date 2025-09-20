const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String }, // For text data
  fileUrl: { type: String }, // For file uploads (optional) - keeping for backward compatibility
  // New fields for storing file data in database
  fileName: { type: String }, // Original filename
  fileData: { type: Buffer }, // File content as binary data
  fileMimeType: { type: String }, // MIME type of the file
  fileSize: { type: Number }, // File size in bytes
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserData', DataSchema); 