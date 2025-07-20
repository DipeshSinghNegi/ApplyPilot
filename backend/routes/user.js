const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /user (with Bearer token)
router.get('/', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token' });
  }
  const token = auth.split(' ')[1];
  const user = await User.findOne({ token });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

module.exports = router;