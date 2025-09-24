const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  storedName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  fileData: { type: Buffer, required: true }, // Store file content in database
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dataId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserData' }, // Optional: link to specific data entry
  uploadedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

// Index for efficient queries
FileSchema.index({ userId: 1, isActive: 1 });
FileSchema.index({ dataId: 1, isActive: 1 });

module.exports = mongoose.model('File', FileSchema);
