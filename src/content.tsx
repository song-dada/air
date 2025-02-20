import React, {useState, useEffect, useRef} from 'react';

import { KakaoMap } from './jaekyeong/KakaoMap';
import Info from './da2/info';
import alasql from "alasql";
import './dageom/sass/content.scss'



function Main() {
    const [mode, setMode] = useState(true);

    const [allDatas, setAllData] = useState<any[]>([]);
    const [sido, setSido] = useState('');
    const [station, setStation] = useState('');

    const [sidoList, setSidoList] =  useState<any[]>([]);
    const [stationList, setStationList] = useState<any[]>([])
    const [oneRow, setOneRow] = useState<any>([])

    useEffect(() => {
        let url = "/today";
        
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            setAllData(data);
          })
          .catch((error) => {
            console.log(error)
        });
    }, []);

    // 시도 리스트 설정
    useEffect(() => {
        let dataList: any[] = [];
            let qurey = 'SELECT DISTINCT sidoName FROM ?';
            dataList = alasql(qurey,[allDatas]) ;
            const list = dataList.map((item) => ({
                key: item.sidoName,  // sidoName을 key로 사용
                value: item.sidoName, // sidoName을 그대로 value로 저장
              }));
              console.log(list);
            setSidoList(()=> list );
            // setSido(  );
            setStationList(()=> [] );
    }, [allDatas]);
    
    // 측정소 리스트 설정
    useEffect(() => {
        let dataList: any[] = [];
        let qurey = 'SELECT * FROM ? '; // 기본
        if(sido !== ''){
            qurey+=`WHERE sidoName="${sido}"`;
        }
        dataList = alasql(qurey,[allDatas]) ;

        const list = dataList.map((item) => ({
            key: item.stationName,
            value: item.stationName
        }));

        setStationList( list );


        qurey = 'SELECT Avg(pm10Value), Avg(pm25Value), Avg(o3Value), Avg(no2Value), Avg(so2Value), Avg(coValue), Avg(khaiValue) FROM ? '; // 기본
        if(sido !== ''){
            qurey+=`WHERE sidoName="${sido}"`;
        }
        dataList = alasql(qurey,[allDatas]);

        console.log( "dataList" );
        console.log( dataList );

        const oneRow = dataList[0];
        console.log( oneRow );
        setOneRow( oneRow );

    }, [sido]);

    // 한행 설정 세부2로 넘길수 있으려나
    useEffect(() => {
        let dataList: any[] = [];
        let qurey = 'SELECT * FROM ? '; // 기본
        if(sido !== ''){
            qurey+=`WHERE sidoName="${sido}" AND stationName="${station}"`;
        }
        dataList = alasql(qurey, [allDatas]) ;

        setOneRow( dataList[0] );
        const oneRow = dataList[0]; 
        console.log( oneRow );

    }, [station]);

    const d = 
    <>
        <select name="sido" id="sido" onChange={(e) => setSido(e.currentTarget.value)}>
            {sidoList.map((item) => (
                <option key={item.key} value={item.value}>
                    {item.value}
                </option>
            ))}
        </select>
        <select name="station" id="station" onChange={(e) => setStation(e.currentTarget.value)}>
            {stationList.map((item) => (
                <option key={item.key} value={item.value}>
                    {item.value}
                </option>
            ))}
        </select>
    </>
    return(
        <div className="center">
            <div className="click">
                <KakaoMap/>
            </div>

            {/* <div className="infoA"> */}
                <Info onMode={ mode } onOneRow={oneRow !== undefined ? oneRow : 135}/>

            {/* </div> */}
        </div>
    )
}



export default Main;