const db = require('../db/connection');

class AirQualityStatics{
  constructor ( id ) {
    this.id = id;
    this.data = null;
  }
  getTargetData(res, startDate, endDate, station) {
    const query = `
      SELECT 
        dataTime AS date, 
        stationName AS 측정소,
        pm10Value AS 미세먼지,
        pm25Value AS 초미세먼지,
        o3Value AS 오존,
        so2Value AS 이산화황,
        coValue AS 일산화탄소,
        no2Value AS 이산화질소
      FROM air_quality_day
      WHERE dataTime BETWEEN '${startDate}' AND '${endDate}'
        AND stationName IN ("${station}")
      ORDER BY dataTime;
    `;
    db.getConnection().query(query, (err, result) => {
      if ( err ) {
        console.log('statics getData Error', err);
      } else {
        console.log(`stationName=${station}: ${startDate}~${endDate} statics data success`);
        res.json(result);
      }
    })
  }
}

module.exports = new AirQualityStatics('statics');

