const express = require('express');
const router = express.Router();
const monthData = require('../components/airQualityMonth');

router.get('/month', (req, res) => {
  const targetMonth = req.query.month;
  monthData.targetMonthAvgData(res, targetMonth);
});

module.exports= router;

