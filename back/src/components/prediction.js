const axios = require('axios');
const db = require('../db/connection');

class Prediction {
  constructor(id) {
    this.id = id;
  }
  getPredictionData(res) {
    const query = `SELECT A.predDate, A.stationName, A.pm10Value, A.pm25Value, B.addr FROM air_quality_prediction A
      LEFT JOIN station B 
      ON A.stationName = B.stationName
    `;
    db.getConnection().query(query, (err, result) => {
      if (err) {
        console.log(`prediction data load failed.`, err);
      } else {
        console.log(`prediction data load success.`);
        res.json(result);
      }
    });
  }
}

module.exports = new Prediction('a');
