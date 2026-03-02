const db = require('../config/db');

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT user_id, full_name, email, phone_number, user_type, is_premium, location, created_at FROM users WHERE user_id = ?',
      [req.user.user_id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  const { full_name, phone_number, location } = req.body;
  try {
    await db.execute(
      'UPDATE users SET full_name = ?, phone_number = ?, location = ? WHERE user_id = ?',
      [full_name, phone_number, location, req.user.user_id]
    );
    res.json({ message: 'Profile updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
};

// Get all farmers (for buyers/admins)
exports.getAllFarmers = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT user_id, full_name, email, phone_number, location, is_premium FROM users WHERE user_type = "farmer"'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};