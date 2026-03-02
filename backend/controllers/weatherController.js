const db = require('../config/db');

// Create/update weather (admin only)
exports.createOrUpdateWeather = async (req, res) => {
  if (req.user.user_type !== 'admin') return res.status(403).json({ message: 'Admin only' });

  const { district, temperature, rainfall_probability, forecast_text } = req.body;
  try {
    const [existing] = await db.execute('SELECT weather_id FROM weather_updates WHERE district = ?', [district]);
    if (existing.length > 0) {
      await db.execute(
        'UPDATE weather_updates SET temperature = ?, rainfall_probability = ?, forecast_text = ?, updated_at = CURRENT_TIMESTAMP WHERE district = ?',
        [temperature, rainfall_probability, forecast_text, district]
      );
      res.json({ message: 'Weather updated' });
    } else {
      await db.execute(
        'INSERT INTO weather_updates (district, temperature, rainfall_probability, forecast_text) VALUES (?, ?, ?, ?)',
        [district, temperature, rainfall_probability, forecast_text]
      );
      res.status(201).json({ message: 'Weather created' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to save weather' });
  }
};

// Get all weather updates
exports.getAllWeather = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM weather_updates ORDER BY district');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get weather by district
exports.getWeatherByDistrict = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM weather_updates WHERE district = ?', [req.params.district]);
    if (rows.length === 0) return res.status(404).json({ message: 'District not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};