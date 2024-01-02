const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Authentication endpoint
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
