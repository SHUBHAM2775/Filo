const express = require('express');
const jwt = require('jsonwebtoken');
const UserData = require('../models/Data');
const User = require('../models/User');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Multer setup - store in memory for database storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Auth middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Get all data for user
router.get('/', auth, async (req, res) => {
  const data = await UserData.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json(data);
});

// Get one data item
router.get('/:id', auth, async (req, res) => {
  const data = await UserData.findOne({ _id: req.params.id, userId: req.userId });
  if (!data) return res.status(404).json({ message: 'Not found' });
  res.json(data);
});

// Serve file from database
router.get('/file/:id', auth, async (req, res) => {
  try {
    const data = await UserData.findOne({ _id: req.params.id, userId: req.userId });
    if (!data || !data.fileData) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Set appropriate headers
    res.set({
      'Content-Type': data.fileMimeType,
      'Content-Length': data.fileSize,
      'Content-Disposition': `inline; filename="${data.fileName}"`
    });

    // Send file data
    res.send(data.fileData);
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({ message: 'Error serving file' });
  }
});

// Create data (with file upload)
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const { title, content } = req.body;
    
    const dataFields = { 
      title, 
      content, 
      userId: req.userId 
    };

    // If file is uploaded, store it in database
    if (req.file) {
      dataFields.fileName = req.file.originalname;
      dataFields.fileData = req.file.buffer;
      dataFields.fileMimeType = req.file.mimetype;
      dataFields.fileSize = req.file.size;
      // Keep fileUrl for backward compatibility - it will point to our new file endpoint
      dataFields.fileUrl = `/api/data/file/${req.userId}_${Date.now()}`;
    }

    const data = new UserData(dataFields);
    await data.save();

    // Update fileUrl with actual document ID
    if (req.file) {
      data.fileUrl = `/api/data/file/${data._id}`;
      await data.save();
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating data:', error);
    res.status(500).json({ message: 'Error creating data' });
  }
});

// Update data
router.put('/:id', auth, async (req, res) => {
  const { title, content, fileUrl } = req.body;
  const data = await UserData.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { title, content, fileUrl },
    { new: true }
  );
  if (!data) return res.status(404).json({ message: 'Not found' });
  res.json(data);
});

// Delete data
router.delete('/:id', auth, async (req, res) => {
  const data = await UserData.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!data) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router; 