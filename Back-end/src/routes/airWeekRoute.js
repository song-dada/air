const express = require('express');
const router = express.Router();
const weekData = require('../components/airQualityWeek');

router.get('/week', (req, res) => {
  const targetStation = req.query.stationName;
  weekData.getWeekData(res, targetStation);
});

module.exports= router;

