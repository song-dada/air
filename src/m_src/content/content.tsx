import React, {useState, useEffect, useRef} from 'react';
import alasql from "alasql";

import Left from './left/left';
import Center from './center/center';
import Right from './right/right';
// dageom

import './content.scss'

function Content() {
    const [allDatas, setAllData] = useState<any[]>([]);
    const [prevMonthDatas, setPrevMonthDatas] = useState<any[]>([]);
    const [prevWeekDatas, setPrevWeekDatas] = useState<any[]>([]);

    const [predictionDatas, setPredictionDatas] = useState<any[]>([])
    
    const [sido, setSido] = useState('');
    const [station, setStation] = useState('');

    const [sidoList, setSidoList] =  useState<any[]>([]);
    const [stationList, setStationList] = useState<any[]>([])
    const [oneRow, setOneRow] = useState<any>([])
    const [prevWeekRow, setPrevWeekRow] = useState<any>([])
    const [prevMonthRow, setPrevMonthRow] = useState<any>([])

    // 자료 가져옴
    useEffect(() => {
        // 오늘 데이터 연결
        let url = "/today";
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            setAllData( data );
          })
          .catch((error) => {
            console.log(error)
        });

        // 이전 데이터
        const date = new Date();
        const nowYear = date.getFullYear(); // 올해 설정
        const prevMonth = date.getMonth(); // 전월 데이터
        let ze='';
        if(prevMonth<10){ ze = '0'}
        url = `/month?month=${nowYear}-${ze}${prevMonth}`; // 올해 전 달
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            setPrevMonthDatas( data );
          })
          .catch((error) => {
            console.log(error)
        });

        // *
        // 예측 데이터
        url = "/prediction";

        fetch(url)
            .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
            })
            .then((data) => {
                setPredictionDatas( data );
            })
            .catch((error) => {
            console.log(error)
        });
    }, []);

    // 시도 리스트 설정
    useEffect(() => {
        let dataList: any[] = [];
            let query = 'SELECT DISTINCT sidoName FROM ?';
            
            dataList = alasql(query,[allDatas]); 
            if (dataList.length > 0) { 
                const list = dataList.map((item) => ({
                    key: item.sidoName,  // sidoName을 key로 사용
                    value: item.sidoName, // sidoName을 그대로 value로 저장
                  }));
                setSidoList(list);
                setStationList(()=> [] );

                setSido(dataList[0]["sidoName"])
            }
    }, [allDatas]);

    useEffect(() => {
        let dataList: any[] = [];
        let query = 'SELECT * FROM ? '; // 기본
        if(sido !== ''){  query+=`WHERE sidoName="${sido}" `; }
        dataList = alasql(query,[allDatas]) ;
        if(dataList.length>0){
            const oneRow = dataList[0];
            
            const list = dataList.map((item) => ({
                key: item.stationName,
                value: item.stationName
            }));
            setStationList( list );

            setStation(prev => oneRow["stationName"] );
            setOneRow((prev: any) => oneRow );
        }
    }, [sido]);

    useEffect(() => {
        let dataList: any[] = [];
        let query = "SELECT * FROM ? WHERE stationName = ?";
        dataList = alasql(query, [allDatas, station]) ;

        if (dataList.length > 0 ) {
            setOneRow( dataList[0] );

            let url = "/week?stationName="+station;
            fetch(url)
                .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
                })
                .then((data) => {
                    console.log("이전 7(6+오늘)일 연결완료");
                    let list = [... data, dataList[0]];
                    setPrevWeekDatas( list );
                })
                .catch((error) => {
                console.log(error)
            });
            
        }
        if (prevMonthDatas.length > 0) {    
            let prevData: any[] = alasql(query, [prevMonthDatas, station]);

            if (prevData.length > 0) {
                console.log( prevData[0] );
                setPrevMonthRow( prevData[0] ); 
            }
        }
    }, [station]);

    useEffect(() => {
        let prevData: any[] = [];
        let query = "SELECT * FROM ? WHERE stationName = ?";
        prevData = alasql(query, [prevMonthDatas, station])
        if(prevData.length > 0){
            setPrevMonthRow( prevData[0] ); // 해당 스테이션 지난달 평균
        }
    }, [oneRow]);
    useEffect(()=>{
       
        if(prevWeekDatas.length > 0){
            let query = `SELECT 
            AVG(coValue),
            AVG(no2Value),
            AVG(o3Value),
            AVG(pm10Value),
            AVG(pm25Value),
            AVG(so2Value)
            FROM ? WHERE stationName = ?`;
            let prevWeekData: any[] = alasql(query, [prevWeekDatas, station]);
            if(prevWeekData.length > 0){
                setPrevWeekRow((prev: any) => prevWeekData[0] ); // 지난주 값 평균 데이터
            }
        }
    },[prevWeekDatas]);

    const giveStation=( itme: any)=>{
        setStation(itme);
    }

    const d = (
        <>
            <select name="sido" id="sido" onChange={(e) => setSido(e.currentTarget.value)}>
                {sidoList.map((item) => (
                    <option key={item.key} value={item.value}>
                        {item.value}
                    </option>
                ))}
            </select>
            <select name="station" id="station" onChange={(e) => setStation(e.currentTarget.value)}>
                { stationList.map((item) => (
                    <option key={item.key} value={item.value}>
                        {item.value}
                    </option>
                ))}
            </select>
        </>
    )

    return(
        <>
            <div className="mainContentArea" style={{display: 'flex'}}>
                <div className='select'>{d}</div>
                <Center getOneRow={ oneRow }
                onSetStation={( reStstion: string )=>{ giveStation( reStstion) } } />
                <Left
                getData={ allDatas }
                getOneRow={ oneRow }
                getPrevWeekRow={ prevWeekRow }
                getPrevMonthRow={ prevMonthRow }
                getPrevWeekDatas={prevWeekDatas} />
                <Right
                getData={ allDatas }
                getOneRow={ oneRow }
                onSidoList={sidoList}
                onStation={station}
                getPrediction={ predictionDatas }
                getPrevWeekDatas={prevWeekDatas}/>

            </div>
        </>
    )
}
export default Content;