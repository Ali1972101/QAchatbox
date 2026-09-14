const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/user');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`;
    cb(null, name);
  }
});

const upload = multer({ storage });


router.post('/upload-avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const avatarUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(userId, { avatarUrl }, { new: true }).select('-password');
    res.json({ message: 'Avatar uploaded', user });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ message: 'Unable to upload avatar' });
  }
});

router.post('/upload-status', authenticateToken, upload.single('statusImage'), async (req, res) => {
  try {
    const userId = req.user.userId;
    const statusText = req.body.statusText || '';
    const statusImageUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const user = await User.findByIdAndUpdate(userId, { statusText, statusImageUrl }, { new: true }).select('-password');
    res.json({ message: 'Status updated', user });
  } catch (error) {
    console.error('Upload status error:', error);
    res.status(500).json({ message: 'Unable to upload status' });
  }
});


router.get('/search', authenticateToken, async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json([]);
    const regex = new RegExp(q, 'i');
    const users = await User.find({ $or: [{ name: regex }, { email: regex }] }).select('name email avatarUrl statusText');
    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Unable to search users' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.userId } }).select('name email avatarUrl statusText');
    res.json(users);
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ message: 'Unable to list users' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name email avatarUrl statusText statusImageUrl');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Unable to load user' });
  }
});

module.exports = router;
