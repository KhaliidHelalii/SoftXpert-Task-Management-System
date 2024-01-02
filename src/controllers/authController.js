const authService = require('../services/authService');

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const token = await authService.authenticateUser(username, password);
    res.json({ token });
  } catch (error) {
    next(error);
  }
};
