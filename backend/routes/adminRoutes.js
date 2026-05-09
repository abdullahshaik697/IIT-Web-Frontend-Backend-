const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "111222";
const JWT_SECRET = process.env.JWT_SECRET;

// Admin Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
  }
});

module.exports = router;
