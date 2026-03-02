const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res) => {
  const { full_name, email, phone_number, password, user_type, location } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      'INSERT INTO users (full_name, email, phone_number, password_hash, user_type, location) VALUES (?, ?, ?, ?, ?, ?)',
      [full_name, email, phone_number, hashedPassword, user_type, location]
    );

    const token = jwt.sign(
      { user_id: result.insertId, user_type },
      process.env.JWT_SECRET || 'MY_SECRET_KEY_2026',
      { expiresIn: '1d' }
    );

    res.status(201).json({ token, user_id: result.insertId, user_type });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { user_id: user.user_id, user_type: user.user_type },
      process.env.JWT_SECRET || 'MY_SECRET_KEY_2026',
      { expiresIn: '1d' }
    );

    res.json({ token, user_id: user.user_id, user_type: user.user_type });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
};