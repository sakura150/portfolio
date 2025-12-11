const jwt = require('jsonwebtoken');

require('dotenv').config();

const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'development_secret', { expiresIn: '1h' });

exports.authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Нет токена' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Неверный токен' });
  }
};