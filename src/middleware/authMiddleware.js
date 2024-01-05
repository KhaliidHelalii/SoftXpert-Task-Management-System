const jwt = require('jsonwebtoken');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join( '../.env') });

exports.authenticate = async (req, res, next) => {
  const token = req.header('Authorization');
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication token is missing' });
  }
  //console.log('Received Token:', token);


  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid user' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
