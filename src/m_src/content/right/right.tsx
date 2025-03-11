import React, {useState, useEffect, useRef} from 'react';
import alasql from "alasql";
import BarChart from './barChart/barCahrt';
import Alert from './alert/alert';

import LineChart from './line/linechart';

interface getList {
    name?: string;
    pm10Value?: number;
    pm25Value?: number;
}
const Right = ( props: any ) => {
    const [tryQuery, setTryQuery] = useState<boolean>(true);
    const [pm10List, setPm10List] = useState<any>([]);
    const [pm25List, setPm25List] = useState<any>([]);
    const [toDayList, setToDayList] = useState<any>([]);
    console.log("rigthe file props check")
    console.log(props)

    const avgListCall = ( table: any) => {
        const q  = `SELECT 
        sidoName,
        AVG(pm10Value) as pm10Value,
        AVG(pm25Value) as pm25Value
        FROM ?
        GROUP BY sidoName`;
        const result: any[] = alasql(q, [table])
        // console.log("ㅡㅡㅡㅡㅡㅡresultㅡㅡㅡㅡㅡㅡ")
        // console.log(result)
        let list: any[] = [];
        for (let i = 0; i < result.length; i++) {
            let returnData: getList = { 
                name: result[i]. sidoName,
                pm10Value: Math.ceil(result[i].pm10Value),
                pm25Value: Math.ceil(result[i].pm25Value)
              };
              list.push(returnData);
        }
        return list
    }

    useEffect(()=>{
        // console.log(tryQuery)
        if (props.getData?.length > 0) {
           const avgList = avgListCall(props.getData);
           setToDayList(avgList);
        }

        // console.log(toDayList)
        const today = new Date();
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(today.getDate() - 3);
        const threeDaysLater = new Date();
        threeDaysLater.setDate(today.getDate() + 3);
        
        const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD 형식
        const threeDaysAgoStr = threeDaysAgo.toISOString().split("T")[0];
        const threeDaysLaterStr = threeDaysLater.toISOString().split("T")[0];

        if(props.getPrediction?.length > 0){
            const q = `
                SELECT stationName, dataTime, pm10Value, pm25Value
                FROM ? 
                WHERE stationName = ? 
                    AND dataTime BETWEEN ? AND ?

                UNION ALL

                SELECT stationName, predDate AS dataTime, pm10Value, pm25Value
                FROM ? 
                WHERE stationName = ? 
                    AND predDate BETWEEN ? AND ?

                UNION ALL

                SELECT stationName, dataTime, pm10Value, pm25Value
                FROM ? 
                WHERE stationName = ? 
                    AND DATE(dataTime) = ?
                ORDER BY dataTime
            `;

            const result = alasql(q, [
                props.getPrevWeekDatas, props.onStation, threeDaysAgoStr, todayStr, 
                props.getPrediction, props.onStation, todayStr, threeDaysLaterStr, 
                props.getOneRow, props.onStation, todayStr
            ]);

            // console.log(result);

            setPm10List(result);
            setPm25List(result);
        }
    },[props])

    return(
        <div className="rightArea">
            {/* <Alert onAdata={ props.getData } ></Alert> */}
            <div className="ratiograph">
                <h3>시도별 평균 대기정보</h3>
                {/* <PieChart onOneRow={ props.getOneRow }/> */}
                <BarChart getTodayList={ toDayList }/>
            </div>
            <div className="linegraph">
                <h3>예상 대기질</h3>
                <LineChart onPm10={ pm10List } onPm25={ pm25List }></LineChart>
            </div>
        </div>
    )
}

export default Right;