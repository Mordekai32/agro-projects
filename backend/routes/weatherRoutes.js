const express = require('express');
const { createOrUpdateWeather, getAllWeather, getWeatherByDistrict } = require('../controllers/weatherController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createOrUpdateWeather);
router.get('/', getAllWeather);
router.get('/:district', getWeatherByDistrict);

module.exports = router;