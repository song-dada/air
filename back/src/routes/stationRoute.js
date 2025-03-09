const express = require('express');
const router = express.Router();
const stationData = require('../components/station');

router.get('/station', (req, res) => {
  stationData.getStationData(res);
});

module.exports= router;

