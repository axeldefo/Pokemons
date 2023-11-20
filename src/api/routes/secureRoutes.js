// routes/secureRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../loaders/authMiddleware');  // Correction ici

// Utilisez authenticateToken comme middleware pour sécuriser cette route
router.get('/', authenticateToken, (req, res) => {
    console.log("rout1");
  res.json({ message: 'This is a secure route' });
});

module.exports = router;
