const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    console.log('Register request body:', req.body); 
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ username, email, password });
    console.log('User created:', user); 
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: user.id, username, email } });
  } catch (err) {
    console.error('Registration error:', err); 
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    console.log("Login request body:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email и пароль обязательны!" });
    }

    const user = await User.findOne({ where: { email } });
    console.log("Found user:", user); 

    if (!user) {
      return res.status(400).json({ error: "Пользователь не найден" });
    }

    const isMatch = await user.comparePassword(password);
    console.log("Password match:", isMatch); 

    if (!isMatch) {
      return res.status(400).json({ error: "Неверный пароль" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "1h" });
    res.json({ token, user: { id: user.id, username: user.username, email } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Ошибка сервера", details: err.message });
  }
};


