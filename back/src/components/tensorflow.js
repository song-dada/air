// db에서 데이터받구 전처리하구 모델 설정하고 학습후 DB에 저장.
// 놓친부분 예측결과 해석 및 시각화 => 정확도 판단... (MAE, MSE, R^2).. MAE, MSE가 낮을수록, R^2가 1에 가까울수록 정확
class Tensorflow {
  constructor(id) {
    this.id = id;
    this.tf = require('@tensorflow/tfjs');
    this.db = require('../db/connection');
    this.stationQueue = [];
    this.stationData = {}; //  각 스테이션 데이터
    this.processedDataByStation = {}; //  전처리된 데이터
    this.modelsByStation = {}; // 각 스테이션 별 모델 
  }
  getStations() {
    const query = `SELECT stationName FROM station 
      WHERE addr LIKE('경기%') OR addr LIKE('서울%') OR addr LIKE ('인천%');`
    this.db.getConnection().query(query, (err, result) => {
      if (err) {
        console.log('(ts) getStations failed.', err);
      } else {
        console.log('(ts) getStations success. totalStation : ' + result.length);
        this.stationQueue = result;
        this.processNextStation();
      }
    });
  }
  processNextStation() {
    if (this.stationQueue.length === 0) {
      console.log("All station success.");
      return;
    }
    const station = this.stationQueue.shift();
    const stationName = station.stationName;
    console.log(`${stationName} start: ${this.stationQueue.length} remaining`);
    this.getDataForStation(stationName);
  }
  getDataForStation(stationName) {
    const query = `
      SELECT dataTime as date, pm10Value, pm25Value
      FROM air_quality_day
        WHERE stationName = ?
        AND dataTime BETWEEN DATE_SUB(NOW(), INTERVAL 30 DAY) AND NOW()
      GROUP BY DATE(dataTime)
      `;
    this.db.getConnection().query(query, [stationName], (err, result) => {
      if (err) {
        console.log(`${stationName} 훈련용 데이터 조회 failed.`, err);
        this.processNextStation(); // 다음 스테이션으로 넘김.
      } else {
        console.log(`${stationName} 훈련용 데이터 조회 success. ${result.length} results`);
        this.stationData[stationName] = result;
        this.getTodayStation(stationName);
      }
    });
  }
  getTodayStation(stationName) {
    const query = `
      SELECT dataTime as date, pm10Value, pm25Value
      FROM air_quality
      WHERE stationName = ?
      GROUP BY DATE(dataTime)
      `;
    this.db.getConnection().query(query, [stationName], (err, result) => {
      if (err) {
        console.log(`${stationName} (fs) today data failed ...:`, err);
        this.preprocessing(stationName);
      } else if(result.length > 0) {
        console.log(`${stationName} (fs) today data success ...`);
        this.stationData[stationName] = [...this.stationData[stationName], ...result];
        this.preprocessing(stationName);
      } else {
        console.log(`${stationName} (fs) today data none ...`);
        this.preprocessing(stationName);
      }
    });
  }
  preprocessing(stationName) {
    const data = this.stationData[stationName];
    if (!data) {
      console.log(`${stationName} 전처리할 데이터가 없습니다.`);
      this.processNextStation();
      return;
    }
    const pm10Values = data.map(item => item.pm10Value);
    const pm25Values = data.map(item => item.pm25Value);
    
    const [pm10Min, pm10Max] = [Math.min(...pm10Values), Math.max(...pm10Values)];
    const [pm25Min, pm25Max] = [Math.min(...pm25Values), Math.max(...pm25Values)];

    const windowSize = 3;
    const xData = [];
    const yData = [];

    for (let i = 0; i <= data.length - windowSize - 1; i++) {
      const window = [];
      for (let j = 0; j < windowSize; j++) {
        // minmax normalizedV = (x - xmin) / (xmax - xmin) // 0~1 사이 위치값
        const nPm10 = (parseFloat(data[i + j].pm10Value) - pm10Min) / (pm10Max - pm10Min || 1); // 오차 0인경우 대비 1
        const nPm25 = (parseFloat(data[i + j].pm25Value) - pm25Min) / (pm25Max - pm25Min || 1);

        window.push([nPm10, nPm25]);
      }
      xData.push(window); // 정규화된 데이터 전달

      const tPm10 = (parseFloat(data[i + windowSize].pm10Value) - pm10Min) / (pm10Max - pm10Min || 1);
      const tPm25 = (parseFloat(data[i + windowSize].pm25Value) - pm25Min) / (pm25Max - pm25Min || 1);
      yData.push([tPm10, tPm25]);// 정규화된 데이터 전달
    }
    this.processedDataByStation[stationName] = {
      xData,
      yData,
      metadata: { pm10Min, pm10Max, pm25Min, pm25Max, windowSize }
    };
    console.log(`${stationName} 전처리 완료: ${xData.length}개의 시퀀스 생성`);
    this.buildModel(stationName);
  }

  buildModel(stationName) {
    const processedData = this.processedDataByStation[stationName];

    if (!processedData) {
      console.log(`${stationName} data failed...(bM)`);
      this.processNextStation();
      return;
    }

    const { windowSize } = processedData.metadata;

    const model = this.tf.sequential();
    // LSTM 레이어 추가 => dense 레이어 추가순서로.
    model.add(this.tf.layers.lstm({ // 50개의 유닛이 적당하다고함.. 항상 과적합 <-> 학습능력을 같이 고려해야..
      units: 50,
      returnSequences: true,
      inputShape: [windowSize, 2]
    }));

    model.add(this.tf.layers.dropout(0.2)); // dropout 사용해서 20% 버리기

    model.add(this.tf.layers.lstm({
      units: 50,
      returnSequences: false
    }));

    model.add(this.tf.layers.dropout(0.2));

    model.add(this.tf.layers.dense({
      units: 2
    }));
    
    // 설정 optimizer: adam, 손실함수 : meanSqauredError사용으로.. 이후 조정
    model.compile({
      optimizer: 'adam', 
      loss: 'meanSquaredError'
    });

    this.modelsByStation[stationName] = model;
    console.log(`${stationName} 모델 생성 완료`);

    this.trainModel(stationName);
  }
  
  trainModel(stationName) {
    const model = this.modelsByStation[stationName];
    const processedData = this.processedDataByStation[stationName];

    if (!model || !processedData) {
      console.log(`${stationName} model or data train failed .... ...`);
      this.processNextStation();
      return;
    }

    const { xData, yData } = processedData;
    const xTensor = this.tf.tensor3d(xData);
    const yTensor = this.tf.tensor2d(yData);

    console.log(`${stationName} model training start...`);
    
    model.fit(xTensor, yTensor, {
      epochs: 20, // 훈련횟수 추후 조정..
      batchSize: 32, // 훈련횟수와 마찬가지로 단순히 높고 낮음에 따라서 좋고 나쁜게 아니라.. 중간선을 잘 찾아야함..
      callbacks: {
        // 훈련 종료시
        onTrainEnd: () => {
          const predictions = this.predictNext(stationName, 3); 
          this.savePredictions(stationName, predictions);
        }
      }
    });
  }

  // 추후 여유될때 모델평가 하는 부분 및 예측 <-> 실제값 가지고 정확도 그래프로 표현시도.

  predictNext(stationName, days) {
    const model = this.modelsByStation[stationName];
    const processedData = this.processedDataByStation[stationName];

    if (!model || !processedData) {
      console.log(`${stationName} (predictNext)모델 또는 데이터가 존재하지않음.`);
      return null;
    }

    const { xData, metadata } = processedData;
    const { pm10Min, pm10Max, pm25Min, pm25Max, windowSize } = metadata;

    let lastSequence = xData[xData.length - 1];
    const predictions = [];

    for (let i = 0; i < days; i++) {
      const input = this.tf.tensor3d([lastSequence]);
      const prediction = model.predict(input);
      const predictionData = prediction.dataSync();

      const pm10Pred = predictionData[0] * (pm10Max - pm10Min) + pm10Min;
      const pm25Pred = predictionData[1] * (pm25Max - pm25Min) + pm25Min;

      const predDate = new Date();
      predDate.setDate(predDate.getDate() + i + 1); // 한국 시간보다 9시간 느림
      predDate.setHours(predDate.getHours() + 9);
      
      const strDate = predDate.toISOString();
      const d = strDate.substring(0,10);
      predictions.push({
        date: d,
        pm10Value: pm10Pred.toFixed(1),
        pm25Value: pm25Pred.toFixed(1)
      });
      
      lastSequence.shift(); // 오래된 값 제거 및 새로운 값 추가
      lastSequence.push([predictionData[0], predictionData[1]]);
      
      // 종료
      input.dispose();
      prediction.dispose();
    }

    console.log(`${stationName} ${days}일 예측 완료:`, predictions);
    return predictions;
  }

  savePredictions(stationName, predictions) {
    if (!predictions || predictions.length === 0) {
      console.log(`${stationName} 저장할 예측 데이터가 없습니다.`);
      this.processNextStation();
      return;
    }

    const deleteQuery = `DELETE FROM air_quality_prediction WHERE stationName = ?`;
    this.db.getConnection().query(deleteQuery, [stationName], (err) => {
      if (err) {
        console.log(`${stationName} 기존 예측 데이터 삭제 오류:`, err);
        this.processNextStation();
        return;
      }

      const insertValues = predictions.map(pred => [
        stationName,
        pred.date,
        pred.pm10Value,
        pred.pm25Value
      ]);

      const insertQuery = `
        INSERT INTO air_quality_prediction 
        (stationName, predDate, pm10Value, pm25Value)
        VALUES ?
      `;

      this.db.getConnection().query(insertQuery, [insertValues], (err) => {
        if (err) {
          console.log(`${stationName} 예측 데이터 저장 오류:`, err);
        } else {
          console.log(`${stationName} 예측 데이터 저장 완료: ${predictions.length}일`);
        }

        this.processNextStation();
      });
    });
  }
  execute() {
    console.log('Tensorflow run !');
    this.getStations();
  }
}

module.exports = new Tensorflow('tf');
