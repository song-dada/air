import React, {useState, useEffect, useRef} from 'react';

import Info from './info/info';
import LegendRow from './legend/legendRow';
import Etc from './etc/etc';
import Weekgraph from './weekgraph/weekgraph';

// import Tips from './tip/tip';
// dageom


function Left( props: any ) {
    console.log(props)
    // const [prevWeekRow, setPrevWeekRow] = useState<any>([])
    // const [table, setTable] = useState<any>(props.getPrevWeekDatas)

    useEffect(()=>{

        // console.log("left file props check");
        // console.log(props);
        //     // console.log(props.prevWeekDatas);
        //     // console.log(props.getStation);
       
        // if(props.getPrevWeekDatas?.length > 0){
        //     // console.log( "지난주 데이터 테이블이 생성되었습니다." );
        //     console.log("left file props check");
            // console.log(props.getPrevWeekDatas);
            // console.log(props.getStation);

            // let query = `SELECT 
            // AVG(coValue),
            // AVG(no2Value),
            // AVG(o3Value),
            // AVG(pm10Value),
            // AVG(pm25Value),
            // AVG(so2Value)
            // FROM ?
            // GROUP BY stationName
            // `;
            // // FROM ? WHERE stationName = ?
            // let prevWeekAvg: any[] = alasql(query, [props.getPrevWeekDatas, props.getStation]);
            // if(prevWeekAvg?.length > 0){
            //     console.log(prevWeekAvg)
            // }
                
            
            // if(prevWeekData?.length > 0){
            //     console.log("prevWeekData[0]")
            //     console.log(prevWeekData[0])
            //     setPrevWeekRow( prevWeekData[0] ); // 지난주 값 평균 데이터
            // }
        // }
    },[props]);

    return(
        <>
            <div className="leftArea">
                <div className="circlegraph">
                    <Info getInfo={props.getData} getRow={props.getOneRow} />
                    <LegendRow/>
                </div>
                <Etc getOneRow={props.getOneRow} 
                getYesterDayRow={props.getYesterDay}

                getPrevWeekRow={ props.getPrevWeekRow }  
                getPrevMonthRow={ props.getPrevMonthRow }/>
                <div className="weekgraph">
                    <h3>주간 미세먼지 데이터</h3>
                    <Weekgraph getPrevWeekDatas={ props.getPrevWeekDatas }/>

                </div>
            </div>
        </>
    )
}

export default Left;