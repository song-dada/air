const express = require('express');
const router = express.Router();
const predictionData = require('../components/prediction');

router.get('/prediction', (req, res) => {
  predictionData.getPredictionData(res);
});

module.exports= router;

