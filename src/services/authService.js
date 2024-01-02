const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticateUser = async (username, password) => {
  const user = await User.findOne({ username, password });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
  return token;
};
