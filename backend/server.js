const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Use CORS with specific origin for Vercel frontend (set via env for flexibility)
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));

// Connect to MongoDB (use MONGODB_URI for Render, fallback to MONGO_URI for legacy)
mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/filo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const authRouter = require('./routes/auth');
const dataRouter = require('./routes/data');

app.use('/api/auth', authRouter);
app.use('/api/data', dataRouter);

// Placeholder for routes
app.get('/', (req, res) => {
  res.send('Filo API Running');
});

// Health check route for Render
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// TODO: Add auth and data routes

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
