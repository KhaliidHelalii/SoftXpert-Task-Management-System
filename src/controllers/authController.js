const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authService = require('../services/authService');
const path = require('path');
require('dotenv').config({ path: path.join( '../.env') });


exports.register = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await authService.authenticateUser(username, password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
   // console.log('Generated Token:', token);


    // Return the token
    res.json({ token });
  } catch (error) {
    next(error);
  }
};
