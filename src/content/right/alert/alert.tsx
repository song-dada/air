import './alert.scss'
import { AiFillAlert } from "react-icons/ai";
import alasql from "alasql";
import { useEffect, useState } from 'react';


// hyomin
// dageom


function Alert(props: any) {
    let title: string =''
    let printText: string='';
    let fillColor='#ddd';
    if(props.onYellow?.length > 0){
        let count = props.onYellow.length - 1;
        fillColor='#FEE596';
        title='주의보';
        printText=props.onYellow[0]["stationName"];
        if(count > 0) {printText+=" 외"+count+"곳"}
    }else if(props.red?.length > 0){
        let count = props.onRed.length - 1;
        fillColor='#FF595E';
        title='경보';
        printText=props.onRed[0]["stationName"];
        if(count > 0) {printText+=" 외"+count+"곳"}
    }
    
    return <div className="alert">
        <div className="alertIcon">
            <AiFillAlert fill={ fillColor }/>
        </div>
        <p>{props.title} {title}</p>
        <p>{ printText === '' ? '발령없음' : printText }</p>
    </div>
}

function AlertArea( {onAdata}: any ) {
    const [pm10, setpm10] = useState<any>([]);
    const [pm10E, setpm10E] = useState<any>([]);
    const [pm25, setpm25] = useState<any>([]);
    const [pm25E, setpm25E] = useState<any>([]);
    const [o3, seto3] = useState<any>([]);
    const [o3E, seto3E] = useState<any>([]);

    useEffect(()=>{

        // 미세먼지 주의보
        let query = 'SELECT stationName, pm10Value FROM ? WHERE pm10Value BETWEEN 81 AND 150';
        let reslutList = alasql(query, [onAdata]);
        setpm10( reslutList );
        // 미세먼지 경보
        query = 'SELECT stationName, pm10Value FROM ? WHERE pm10Value >= 151';
        let reslutListE = alasql(query, [onAdata]);
        setpm10E( reslutListE );

        // 초미세먼지 주의보
        query = 'SELECT stationName, pm25Value FROM ? WHERE pm25Value BETWEEN 36 AND 75';
        reslutList = alasql(query, [onAdata]);
        setpm25( reslutList );
        // 초미세먼지 경보
        query = 'SELECT stationName, pm25Value FROM ? WHERE pm25Value >= 76';
        reslutListE = alasql(query, [onAdata]);
        setpm25E( reslutListE );


        // 오존 주의보
        query = 'SELECT stationName, o3Value FROM ? WHERE o3Value BETWEEN 0.091 AND 0.15';
        reslutList = alasql(query, [onAdata]);
        seto3( reslutList );
        // 오존 경보
        query = 'SELECT stationName, o3Value FROM ? WHERE o3Value >= 0.151';
        reslutListE = alasql(query, [onAdata]);
        seto3E( reslutListE );


    },[onAdata])

    
    return <div className="upArea">
        <div className="alertArea">
            <Alert title={"미세먼지"} onYellow={pm10} onRed={pm10E}/>
            <Alert title={"초미세먼지"} onYellow={pm25} onRed={pm25E}/> 
            <Alert title={"오존"} onYellow={o3} onRed={o3E}/> 
        </div>
    </div>
}

export default AlertArea