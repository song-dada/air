import React, {useState, useEffect, useRef} from 'react';
import alasql from "alasql";

import Left from './left/left';
import Center from './center/center';
import Right from './right/right';

import StatData from './statistics/statistics';

// dageom

import './content.scss'

function Content() {
    const [showList, setShowList] = useState<any[]>([]);
    const [datas, setData] = useState<any[]>([]);

    const [allDatas, setAllData] = useState<any[]>([]);
    const [prevMonthDatas, setPrevMonthDatas] = useState<any[]>([]);
    const [prevWeekDatas, setPrevWeekDatas] = useState<any[]>([]);

    // *
    const [predictionDatas, setPredictionDatas] = useState<any[]>([])
    
    const [mode, setMode] = useState('close');
    const [sido, setSido] = useState('');
    const [station, setStation] = useState('');

    const [sidoList, setSidoList] =  useState<any[]>([]);
    const [stationList, setStationList] = useState<any[]>([])
    const [oneRow, setOneRow] = useState<any>([])
    const [prevWeekRow, setPrevWeekRow] = useState<any>([])
    const [prevMonthRow, setPrevMonthRow] = useState<any>([])
    const [yesterDay, setYesterDay] = useState<any>([])

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
            // console.log(data)
            setAllData( data );
          })
          .catch((error) => {
            console.log(error)
        });

        // 이전 데이터
        const date = new Date();
        const nowYear = date.getFullYear(); // 올해 설정
        const prevMonth = date.getMonth(); // 전월 데이터
        // http://kkms4001.iptime.org:21168/month?date=2024-02
        // http://kkms4001.iptime.org:21168/day?day=2025-02-21
        // url = "/month?date=2025-01";
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
            // console.log(data)
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
                // console.log(data)
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
            console.log(allDatas)
            console.log(dataList)

            const list = dataList.map((item) => ({
                key: item.sidoName,
                value: item.sidoName
            }));
            console.log(list)
            setSidoList(list);
            // setSidoList(dataList);

            // 처음 랜더시 나오는 데이터
            if (dataList.length > 0) { 
                setSido(dataList[0]["sidoName"])
            }
    }, [allDatas]);
    
    // 측정소 리스트 설정 시도가 새로 설정 될시 실행됨
    useEffect(() => {
        console.log( "시도" );
        console.log( sido );

        let dataList: any[] = [];
        let query = 'SELECT * FROM ? '; // 기본
        if(sido !== ''){
            query+=`WHERE sidoName="${sido}" `; // ORDER BY stationName`;
        }
        dataList = alasql(query,[allDatas]) ;

        // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

       const list = dataList.map((item) => ({
                key: item.sidoName,
                value: item.sidoName
            }));

        setStationList( list );
        // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

        if(dataList.length>0){
            const oneRow = dataList[0];

            // console.log( "쿼리 생성 이후 넘기는 값인 한행 설정" );
            // console.log( oneRow );
            // console.log( oneRow["stationName"] );
            setStation(oneRow.stationName );
            setOneRow((prev: any) => oneRow );
        }
    }, [sido]);

    // 스테이션 변경시 가져오는 값들
    useEffect(() => {
        // console.log( "스테이션 설정됨" );
        // console.log( station );

        let dataList: any[] = [];
        let query = "SELECT * FROM ? WHERE stationName = ?";
        dataList = alasql(query, [allDatas, station]) ;

        if (dataList.length > 0 ) {
            // console.log( " 스테이션 설정후 뜨는 로고 오늘의 데이터를 가져옴 " );
            // console.log( "오늘의 데이터를 가져왔습니다." );
            // console.log( dataList[0] );
            // 해당 스테이션의 오늘 값 설정
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
                    // console.log(list)
                    setPrevWeekDatas( list );
                    setYesterDay(data[data.length-1])
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

    // 해당 스테이션의 오늘 값 설정 완료 되면
    useEffect(() => {
        let prevData: any[] = [];
        let query = "SELECT * FROM ? WHERE stationName = ?";
        prevData = alasql(query, [prevMonthDatas, station])
        if(prevData.length > 0){
            // console.log( "지난 달 데이터를 가져왔습니다." );
            // console.log(  prevData[0] )
            setPrevMonthRow( prevData[0] ); // 해당 스테이션 지난달 평균
        }
    }, [oneRow]);
    // 지난달 데이터를 가져오고
    // 지난달 데이터가 설정되면 // 주 값 가져옴
    
    
    // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
    useEffect(()=>{
       
        if(prevWeekDatas.length > 0){
            // console.log( "지난주 데이터 테이블이 생성되었습니다." );
            // console.log(prevWeekDatas);

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
    // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

    const giveStation=( itme: any)=>{
        setStation(itme);
    }

    
    return(
        <>
        <div className="mainContentArea" style={{display: 'flex'}}>
            <Left
            getData={ allDatas }
            getOneRow={ oneRow }
            getPrevWeekRow={ prevWeekRow }
            getPrevMonthRow={ prevMonthRow }
            // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
            getYesterDay={yesterDay}
            getPrevWeekDatas={ prevWeekDatas } />
            {/* // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ */}

            <Center getOneRow={ oneRow }
            onSetStation={( reStstion: string )=>{ giveStation( reStstion) } }
            // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
            onSetMode={(mode: string)=>{setMode( mode )}}
            // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
            />
            <Right
            getData={ allDatas }
            getOneRow={ oneRow }
            onSidoList={sidoList}
            onStation={station}
            getPrediction={ predictionDatas }
            getPrevWeekDatas={prevWeekDatas}/>

        </div>
        {/* // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ */}
        {/* <div className="popUpContentArea">
            <Popup getMode={mode} 
            getData={ allDatas }
            // getSidoList = {sidoList}
            onSidoList={sidoList}

            onSetMode={(mode: string)=>{setMode( mode )}}
            />
        </div> */}
        {/* // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ */}
        {/* <div className='statisics'> */}
            <StatData
                getMode={mode}
                getData={ allDatas }
                onSidoList={sidoList}
                onSetMode={(mode: string)=>{setMode( mode )}}

            ></StatData>
        {/* </div> */}

        </>
    )
}
export default Content;