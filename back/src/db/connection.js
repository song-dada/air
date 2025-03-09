const mysql = require('mysql');
const configs = require('../configs/config.js');

class DatabaseConnection {
  constructor() {
    this.connection = null;
  }
  connect() {
    this.connection = mysql.createConnection({
      ...configs,
      dateStrings: true
    });

    this.connection.connect((err) => {
      if (err) {
        console.log('data connection failed.', err);
      } else {
        console.log('data connection success.');
      }
    });
    return this.connection;
  }
  getConnection() {
    if (!this.connection) {
      return this.connect();
    }
    return this.connection;
  }
}

module.exports = new DatabaseConnection();
