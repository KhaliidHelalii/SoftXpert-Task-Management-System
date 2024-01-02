// authController.js
const bcrypt = require('bcrypt');
const User = require('../models/User');
const authService = require('../services/authService');

exports.register = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
    });

    // Save the user to the database
    await newUser.save();

    res.json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Authenticate the user
    const user = await authService.authenticateUser(username, password);

    // Return the authenticated user
    res.json({ message: 'User logged in successfully', user });
  } catch (error) {
    next(error);
  }
};

// Other authentication-related controller functions...
