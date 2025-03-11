const moment = require('moment-timezone');
const axios = require('axios');
const db = require('../db/connection');
const today = new Date();
const year = 1900 + today.getYear();
const month = (today.getMonth()+1) < 10 ? '0' + (today.getMonth()) : today.getMonth();
const inputMonth = (String(year) + String(month));
const queryMonth = (String(year) +'-' + String(month));
console.log(inputMonth);
const SERVICE_KEY = require('../configs/servicekey.js');

class AirQualityMonth {
  constructor(id){
    this.id = id;
  }
  updateMonthAvgData() {  
      axios.get('https://apis.data.go.kr/B552584/ArpltnStatsSvc/getMsrstnAcctoRMmrg', {
        params: {
          serviceKey: SERVICE_KEY,
          returnType: 'json',
          numOfRows: 700,
          pageNo: 1,
          inqBginMm: inputMonth,
          inqEndMm: inputMonth
        }
      })
      .then(response => {
        const data = response.data.response.body.items;
        console.log(`last month : ${inputMonth} month avg data mining success.`);
        this.insertMonthAvgData(data);  
      })
      .catch(error => {
        console.log(`last month: ${inputMonth} month avg data mining failed.`, error);
      });
  }
  insertMonthAvgData(data) { 
    const query = `
      INSERT INTO air_quality_month (dataTime, stationName, so2Value, coValue, pm10Value, no2Value, o3Value, pm25Value)
      VALUES ?
      ON DUPLICATE KEY UPDATE
        dataTime = VALUES(dataTime),
        stationName = VALUES(stationName),
        so2Value = VALUES(so2Value),
        coValue = VALUES(coValue),
        pm10Value = VALUES(pm10Value),
        no2Value = VALUES(no2Value),
        o3Value = VALUES(o3Value),
        pm25Value = VALUES(pm25Value)
    `;
    const items = data.map(v => {
      return [
        v.msurMm,
        v.msrstnName,
        v.so2Value === '-' ? null : v.so2Value,
        v.coValue === '-' ? null : v.coValue,
        v.pm10Value === '-' ? null : v.pm10Value,
        v.no2Value === '-' ? null : v.no2Value,
        v.o3Value === '-' ? null : v.o3Value,
        v.pm25Value === '-' ? null : v.pm25Value,
      ];
    });
    db.getConnection().query(query, [items], (err, result) => {
      if (err) {
        console.log(`last Month: ${inputMonth} data save failed.`, err);
      } else {
        console.log(`last Month: ${inputMonth} data save success.`);
      }
    });
  }
  targetMonthAvgData(res, targetMonth) {
    const selectMonth = targetMonth ? `dataTime LIKE '%${targetMonth}%'` : `dataTime LIKE '%${queryMonth}%'`;
    
    const query = `SELECT A.dataTime, A.stationName, A.so2Value, A.coValue, A.pm10Value, A.pm25Value, A.no2Value, A.o3Value, B.addr
      FROM air_quality_month A
      LEFT JOIN station B 
      ON A.stationName = B.stationName
      AND (B.addr LIKE ('서울%') OR B.addr LIKE ('경기%') OR B.addr LIKE ('인천%'))
      WHERE ${selectMonth}
    `;
    db.getConnection().query(query, (err, result) => {
      if (err) {
        console.log(`${selectMonth} avg data load failed. `);
      } else {
        console.log(`${selectMonth} avg data load success.`);
        res.json(result);
      }
    })

  }
}

module.exports = new AirQualityMonth('month');
