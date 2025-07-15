const express = require('express');
const jwt = require('jsonwebtoken');
const UserData = require('../models/Data');
const User = require('../models/User');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

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

// Create data (with file upload)
router.post('/', auth, upload.single('file'), async (req, res) => {
  const { title, content } = req.body;
  let fileUrl = '';
  if (req.file) {
    fileUrl = `/uploads/${req.file.filename}`;
  }
  const data = new UserData({ title, content, fileUrl, userId: req.userId });
  await data.save();
  res.status(201).json(data);
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