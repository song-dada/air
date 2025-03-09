const express = require('express');
const router = express.Router();
const todayData = require('../components/airQualityToday');

router.get('/today', (req, res) => {
  todayData.getTodayData(res);
});

router.get('/region', (req, res) => {
  const region = req.query.region;
  todayData.getTodayDataByRegion(res, region);
})

module.exports= router;

