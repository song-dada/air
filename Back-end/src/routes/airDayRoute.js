const express = require('express');
const router = express.Router();
const dayData = require('../components/airQualityDay');

router.get('/day', (req, res) => {
  const targetDay = req.query.day;
  console.log('targetDay:', targetDay);
  dayData.targetDayAvgData(res, targetDay);
});

module.exports= router;

