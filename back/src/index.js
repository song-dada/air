class AirApp {
  constructor(id) {
    this.id = id;
    this.express = require('express');
    this.cors = require('cors');
    this.app = this.express();
    this.PORT = require('./configs/port');
    this.schedule = require('node-schedule');
    this.airQualityRoutes = require('./routes/airQualityRoutes');
    this.airDayRoute = require('./routes/airDayRoute');
    this.stationRoute = require('./routes/stationRoute');
    this.airMonthRoute = require('./routes/airMonthRoute');
    this.airWeekRoute = require('./routes/airWeekRoute');
    this.predictionRoute = require('./routes/predictionRoute');
    this.staticsRoute = require('./routes/airStaticsRoute');
    this.airQualityDaily = require('./components/airQualityToday');
    this.airQualityDay = require('./components/airQualityDay');
    this.airQualityMonth = require('./components/airQualityMonth');
    this.airPredict = require('./components/tensorflow');
  }
  setRoutes() {
    console.log('routing setting.');
    this.app.use(this.cors());
    this.app.use(this.airQualityRoutes);
    this.app.use(this.stationRoute);
    this.app.use(this.airDayRoute);
    this.app.use(this.airMonthRoute);
    this.app.use(this.airWeekRoute);
    this.app.use(this.predictionRoute);
    this.app.use(this.staticsRoute);
  }
  setupSchedule() { 
    this.schedule.scheduleJob('50 * * * *', () => { // 매 정각 업뎃 server시간이 약 15분전이라 30분으로설정.
      this.airQualityDaily.updateTodayData()
          console.log('실시간 데이터 업데이트 완료');
    });
    this.schedule.scheduleJob('50 */3 * * *', () => {
      this.airPredict.execute();
    })
    this.schedule.scheduleJob('50 1 * * *', () => { // 매일 정각 업뎃 . . . 
      this.airQualityDay.updateDayAvgData();
      this.airQualityDaily.deleteYesterDay();
      console.log('일일 데이터 업데이트 완료 및 tf실행');
    })
    this.schedule.scheduleJob('50 1 1 * *', () => { // 매월 1일 1시 업뎃
      console.log('월간 데이터 업데이트 완료');
      this.airQualityMonth.updateMonthAvgData();
    }) 
  }
  init() {
    this.app.listen(this.PORT, () => {
      console.log(`server ${this.PORT} start!`);
    });
    this.airQualityDaily.updateTodayData();
    this.airQualityDaily.deleteYesterday();
    this.airQualityDay.updateDayAvgData();
    this.airPredict.execute();
    this.airQualityMonth.updateMonthAvgData();
  }
  run() {
    this.cors();
    this.setRoutes();
    this.setupSchedule();
    this.init();
  }
}

const airApp = new AirApp('air');
airApp.run();
