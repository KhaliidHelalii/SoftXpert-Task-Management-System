const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.authenticateUser = async (username, password) => {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error('User not found');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('Invalid password');
    }

    return user;
  } catch (error) {
    throw error;
  }
};
