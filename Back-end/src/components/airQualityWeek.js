const axios = require('axios');
const db = require('../db/connection');

class AirQualityWeek {
  constructor(id) {
    this.id = id;
  }
  getWeekData(res, targetStation) {
    const selectStation = targetStation ? 
      `WHERE A.stationName IN("${targetStation}")` : 
      'WHERE A.stationName IN("중구")';
    const query = `
      SELECT A.dataTime, A.stationName, A.so2Value, 
        A.coValue, A.pm10Value, A.no2Value, A.o3Value, A.pm25Value
      FROM air_quality_day A LEFT JOIN air_quality B
      ON A.stationName = B.stationName
      ${selectStation} AND A.dataTime BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW()
      ORDER BY dataTime DESC;
    `;
    db.getConnection().query(query, (err, result) => {
      if (err) {
        console.log('week Data load failed.', err);
      } else {
        console.log(`${targetStation} week data load success.`);
        res.json(result);
      }
    });
  }
}

module.exports = new AirQualityWeek('week');
