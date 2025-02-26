import React, {useState, useEffect, useRef} from 'react';
import alasql from "alasql";
import PieChart from './piechart/piechart';
import Alert from './alert/alert';

import LineChart from './line/linechart';


function Right( props: any ) {
    const [pm10List, setPm10List] = useState<any>([]);
    const [pm25List, setPm25List] = useState<any>([]);
    // console.log("props.onStation")
    // console.log(props)

    useEffect(()=>{
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
            <Alert onAdata={ props.getData } ></Alert>
            <div className="ratiograph">
                <h3>대기질 비율</h3>
                <PieChart onOneRow={ props.getOneRow }/>
            </div>
            <div className="linegraph">
                <h3>예상 대기질</h3>
                <LineChart onPm10={ pm10List } onPm25={ pm25List }></LineChart>
            </div>
        </div>
    )
}

export default Right;