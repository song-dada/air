const today = new Date();
const year = 1900 + today.getYear();
const month = (today.getMonth()+1) < 10 ? '0' + (today.getMonth()+1) : today.getMonth()+1;
const day = (today.getDate() < 10) ? '0' + (today.getDate()-1) : today.getDate()-1;
const td = (today.getDate() < 10) ? '0' + today.getDate() : today.getDate();
const hour = today.getHours();
const minute = today.getMinutes();
const inputDay = (String(year) + '-' + String(month) + '-' + String(day));
const queryDay = (String(year) + '-' + String(month) + '-' + String(td));
const SERVICE_KEY = require('../configs/servicekey.js');

const axios = require('axios');
const db = require('../db/connection');

class AirQualityToday {
  constructor(id) {
    this.id = id;
  }

  updateTodayData() {  
    const inputRegions = ['경기', '인천', '서울'];
    const promises = [];
    
    inputRegions.forEach(region => {
      const promise = axios.get('https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty', {
        params: {
          serviceKey: SERVICE_KEY,
          returnType: 'json',
          numOfRows: 500,
          pageNo: 1,
          sidoName: region,
          ver: '1.0'
        }
      })
      .then(response => {
        if(!response.data || !response.data.response.body) {
          console.log('today data get failed.');
          return Promise.reject(new Error('todayData get Failed'));
        }
        const data = response.data.response.body.items;
        console.log(`live: ${queryDay} data mining success.`);
        return this.insertTodayData(data);  
      })
      .catch(error => {
        console.log(`live: ${queryDay} data mining error. `, error);
        return Promise.reject(error);
      });
      promises.push(promise);
    });

    return Promise.all(promises)
      .then(() => {
        console.log('todayData update success');
      }) 
      .catch((err) => {
        console.log('todayData update failed');
      });
  }

  insertTodayData(data) { 
    return new Promise((resolve, reject) => {
      const query = `
        INSERT into air_quality (
          dataTime, sidoName, stationName, pm10Value, pm25Value, o3Value, no2Value, so2Value, coValue, khaiValue
        ) VALUES ?
        ON DUPLICATE KEY UPDATE
          pm10Value = VALUES(pm10Value),
          pm25Value = VALUES(pm25Value),
          o3Value = VALUES(o3Value),
          no2Value = VALUES(no2Value),
          so2Value = VALUES(so2Value),
          coValue = VALUES(coValue),
          khaiValue = VALUES(khaiValue)
      `;
      const items = data.map(v => {
        return [
          queryDay,
          v.sidoName,
          v.stationName,
          v.pm10Value === '-' ? null : v.pm10Value,
          v.pm25Value === '-' ? null : v.pm25Value,
          v.o3Value === '-' ? null : v.o3Value,
          v.no2Value === '-' ? null : v.no2Value,
          v.so2Value === '-' ? null : v.so2Value,
          v.coValue === '-' ? null : v.coValue,
          v.khaiValue === '-' ? null : v.khaiValue
        ];
      });
      if(items.length === 0) {
        console.log('insert todayData failed.');
        resolve();
        return;
      }
      db.getConnection().query(query, [items], (err, result) => {
        if (err) {
          console.log(`live:${queryDay} data save failed.`, err);
          reject(err);
        } else {
          console.log(`live:${queryDay} data save success.`);
          resolve(result);
        }
      });
    })
  }
  getTodayData(res) {
    const query = `SELECT A.dataTime, A.sidoName, A.stationName, A.pm10Value, A.pm25Value, A.o3Value, A.no2Value, A.so2Value, A.coValue, A.khaiValue, B.dmX, B.addr, B.dmY
    FROM air_quality A
    LEFT JOIN station B ON A.stationName = B.stationName
    `;
    db.getConnection().query(query, (err, result) => {
      if (err) {
        console.log('today data load failed.', err);
      } else {
        console.log('today data load success.');
        res.json(result);
      }
    });
  }
  getTodayDataByRegion(res, region) {
    const query = `
      SELECT A.dataTime, A.sidoName, A.stationName, A.pm10Value, A.pm25Value, A.o3Value, A.no2Value, A.so2Value, A.coValue, A.khaiValue, B.dmX, B.addr, B.dmY
      FROM air_quality A
      LEFT JOIN station B ON A.stationName = B.stationName
      WHERE B.addr LIKE "%${region}%"
    `;
    db.getConnection().query(query,(err, result) => {
      if (err) {
        console.log('region data load failed.', err);
      } else {
        console.log('region data load success.');
        res.json(result);
      }
    });
  }
  deleteYesterday() {
    const query = `
    DELETE FROM air_quality
    WHERE dataTime LIKE ('%${inputDay}%');
    `;
    db.getConnection().query(query, (err, result) => {
      if( err ) {
        console.log('delete yesterDay failed.');
      } else {
        console.log('delete yesterDay success.');
      }
    })
    }
}

module.exports = new AirQualityToday('air');
