const express = require('express');
const jwt = require('jsonwebtoken');
const UserData = require('../models/Data');
const User = require('../models/User');
const File = require('../models/File');
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
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 10 // Maximum 10 files per upload
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
  try {
    const data = await UserData.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .lean(); // Use lean for better performance
    
    // Manually populate files for each data entry to handle legacy entries
    const populatedData = await Promise.all(
      data.map(async (item) => {
        if (item.files && item.files.length > 0) {
          try {
            const files = await File.find({ 
              _id: { $in: item.files }, 
              isActive: true 
            });
            return { ...item, files };
          } catch (err) {
            console.warn('Error populating files for entry:', item._id, err.message);
            return { ...item, files: [] };
          }
        }
        return { ...item, files: [] };
      })
    );
    
    res.json(populatedData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
});

// Get one data item
router.get('/:id', auth, async (req, res) => {
  try {
    const data = await UserData.findOne({ _id: req.params.id, userId: req.userId }).lean();
    if (!data) return res.status(404).json({ message: 'Not found' });
    
    // Manually populate files to handle legacy entries
    if (data.files && data.files.length > 0) {
      try {
        const files = await File.find({ 
          _id: { $in: data.files }, 
          isActive: true 
        });
        data.files = files;
      } catch (err) {
        console.warn('Error populating files for entry:', data._id, err.message);
        data.files = [];
      }
    } else {
      data.files = [];
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching data item:', error);
    res.status(500).json({ message: 'Error fetching data item', error: error.message });
  }
});

// Serve file from database (by file ID)
router.get('/file/:id', auth, async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, userId: req.userId, isActive: true });
    if (!file || !file.fileData) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Set appropriate headers
    res.set({
      'Content-Type': file.mimeType,
      'Content-Length': file.size,
      'Content-Disposition': `inline; filename="${file.originalName}"`
    });

    // Send file data
    res.send(file.fileData);
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({ message: 'Error serving file' });
  }
});

// Serve file from legacy data entry (backward compatibility)
router.get('/legacy-file/:id', auth, async (req, res) => {
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
    console.error('Error serving legacy file:', error);
    res.status(500).json({ message: 'Error serving legacy file' });
  }
});

// Create data (with multiple file uploads)
router.post('/', auth, upload.array('files', 10), async (req, res) => {
  try {
    const { title, content } = req.body;
    
    const dataFields = { 
      title, 
      content, 
      userId: req.userId,
      files: []
    };

    // Create the data entry first
    const data = new UserData(dataFields);
    await data.save();

    // Process uploaded files
    if (req.files && req.files.length > 0) {
      const fileIds = [];
      
      for (const file of req.files) {
        // Create File document
        const newFile = new File({
          originalName: file.originalname,
          storedName: `${Date.now()}_${file.originalname}`,
          mimeType: file.mimetype,
          size: file.size,
          fileData: file.buffer,
          userId: req.userId,
          dataId: data._id
        });
        
        await newFile.save();
        fileIds.push(newFile._id);
      }
      
      // Update data entry with file references
      data.files = fileIds;
      
      // Keep backward compatibility for single file
      if (req.files.length === 1) {
        const firstFile = req.files[0];
        data.fileName = firstFile.originalname;
        data.fileData = firstFile.buffer;
        data.fileMimeType = firstFile.mimetype;
        data.fileSize = firstFile.size;
        data.fileUrl = `/api/data/file/${fileIds[0]}`;
      }
      
      await data.save();
    }

    // Populate files for response
    await data.populate({
      path: 'files',
      match: { isActive: true }
    });
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating data:', error);
    res.status(500).json({ message: 'Error creating data' });
  }
});

// Add files to existing data entry
router.post('/:id/files', auth, upload.array('files', 10), async (req, res) => {
  try {
    const data = await UserData.findOne({ _id: req.params.id, userId: req.userId });
    if (!data) return res.status(404).json({ message: 'Data not found' });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const fileIds = [];
    
    for (const file of req.files) {
      // Create File document
      const newFile = new File({
        originalName: file.originalname,
        storedName: `${Date.now()}_${file.originalname}`,
        mimeType: file.mimetype,
        size: file.size,
        fileData: file.buffer,
        userId: req.userId,
        dataId: data._id
      });
      
      await newFile.save();
      fileIds.push(newFile._id);
    }
    
    // Add new file IDs to existing files array
    data.files = [...(data.files || []), ...fileIds];
    await data.save();

    // Populate files for response
    await data.populate({
      path: 'files',
      match: { isActive: true }
    });
    res.json(data);
  } catch (error) {
    console.error('Error adding files:', error);
    res.status(500).json({ message: 'Error adding files' });
  }
});

// Update data
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, fileUrl } = req.body;
    const data = await UserData.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, content, fileUrl },
      { new: true }
    ).populate({
      path: 'files',
      match: { isActive: true }
    });
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.json(data);
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ message: 'Error updating data', error: error.message });
  }
});

// Delete individual file
router.delete('/file/:fileId', auth, async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.fileId, userId: req.userId });
    if (!file) return res.status(404).json({ message: 'File not found' });

    // Mark file as inactive instead of deleting (soft delete)
    file.isActive = false;
    await file.save();

    // Remove file reference from data entry if exists
    if (file.dataId) {
      await UserData.updateOne(
        { _id: file.dataId },
        { $pull: { files: file._id } }
      );
    }

    res.json({ message: 'File deleted' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Error deleting file' });
  }
});

// Delete data
router.delete('/:id', auth, async (req, res) => {
  try {
    const data = await UserData.findOne({ _id: req.params.id, userId: req.userId });
    if (!data) return res.status(404).json({ message: 'Not found' });

    // Soft delete associated files
    if (data.files && data.files.length > 0) {
      await File.updateMany(
        { _id: { $in: data.files }, userId: req.userId },
        { isActive: false }
      );
    }

    // Delete the data entry
    await UserData.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ message: 'Error deleting data' });
  }
});

// Get all files for user (optional endpoint)
router.get('/files/all', auth, async (req, res) => {
  try {
    const files = await File.find({ userId: req.userId, isActive: true })
      .select('-fileData') // Exclude file data for listing
      .sort({ uploadedAt: -1 });
    res.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ message: 'Error fetching files' });
  }
});

module.exports = router; 