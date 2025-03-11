const axios = require('axios');
const db = require('../db/connection');

class Station {
  constructor(id) {
    this.id = id;
  }
  getStationData(res) {
    const query = `SELECT stationName, addr, dmX, dmY FROM station
    WHERE addr LIKE ('서울%') OR addr LIKE ('경기%') OR addr LIKE ('인천%')
    `;
    db.getConnection().query(query, (err, result) => {
      if (err) {
        console.log(`station data load failed.`, err);
      } else {
        console.log(`station data load success.`);
        res.json(result);
      }
    });
  }
}

module.exports = new Station('air');
