const moment = require('moment-timezone');
const axios = require('axios');
const db = require('../db/connection');
const today = new Date();
const year = 1900 + today.getYear();
const month = (today.getMonth()+1) < 10 ? '0' + (today.getMonth()+1) : today.getMonth()+1;
const yesterDay = (today.getDate()-1) < 10 ? '0' + (today.getDate()-1) : today.getDate()-1;
const inputDay = (String(year) + String(month)+ String(yesterDay) );
const queryDay = (String(year) + '-' + String(month) + '-'  + String(yesterDay));
const SERVICE_KEY = require('../configs/servicekey.js');

class AirQualityDay {
  constructor(id) {
    this.id = id;
  }
  updateDayAvgData() {  
      axios.get('https://apis.data.go.kr/B552584/ArpltnStatsSvc/getMsrstnAcctoRDyrg', {
        params: {
          serviceKey: SERVICE_KEY,
          returnType: 'json',
          numOfRows: 700,
          pageNo: 1,
          inqBginDt: inputDay,
          inqEndDt: inputDay
        }
      })
      .then(response => {
        const data = response.data.response.body.items;
        console.log(`yesterday : ${inputDay} avg data mining success.`);
        this.insertDayAvgData(data);  
      })
      .catch(error => {
        console.log(`yesterday : ${inputDay} avg data mining failed.`, error);
      });
  }
  insertDayAvgData(data) { 
    const query = `
      INSERT INTO air_quality_day (dataTime, stationName, so2Value, coValue, pm10Value, no2Value, o3Value, pm25Value)
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
        v.msurDt,
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
        console.log(`${inputDay}avg data save failed`, err);
      } else {
        console.log(`${inputDay}avg data save success.`);
      }
    });
  }
  targetDayAvgData(res, targetDay) {
    const selectDay = targetDay ? `A.dataTime LIKE '%${targetDay}%'` : `A.dataTime LIKE '${queryDay}%'`;
    console.log('selectDay:', selectDay);

    const query = `SELECT A.dataTime, A.stationName, A.so2Value, A.coValue, A.pm10Value, A.pm25Value,
     A.no2Value, A.o3Value, B.addr
     FROM air_quality_day A LEFT JOIN station B
     ON A.stationName = B.stationName
     WHERE ${selectDay} AND (B.addr LIKE '서울%' OR B.addr LIKE '경기%' OR B.addr LIKE '인천%')
    `;
    db.getConnection().query(query, (err, result) => {
      if (err) {
        console.log(`${selectDay} data load failed.`);
      } else {
        console.log(`${selectDay} data load success.`);
        res.json(result);
      }
    })
  }
}

module.exports = new AirQualityDay('air');
