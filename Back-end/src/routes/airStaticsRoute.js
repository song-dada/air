const express = require('express');
const router = express.Router();
const staticsData = require('../components/airQualityStatics');

router.get('/statics', (req, res) => {
  const startDate = req.query.s;
  const endDate = req.query.e;
  const targetStation = req.query.stationName;
  staticsData.getTargetData(res, startDate, endDate, targetStation);
});

module.exports= router;

