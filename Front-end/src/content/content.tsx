import React, { useState, useEffect, useRef } from 'react';
import alasql from "alasql";

import Left from './left/left';
import Center from './center/center';
import Right from './right/right';
import StatData from './statistics/statistics';

import './content.scss'

// dageom
const Content = () => {

    // 가져와야하는 데이터 저장소
    const [allDatas, setAllData] = useState<any[]>([]); // 전체
    const [prevMonthDatas, setPrevMonthDatas] = useState<any[]>([]); // 지난 달
    const [prevWeekDatas, setPrevWeekDatas] = useState<any[]>([]); // 지난 주
    const [predictionDatas, setPredictionDatas] = useState<any[]>([]); // 예측 데이터

    const [mode, setMode] = useState('close'); // 검색 쪽

    const [sido, setSido] = useState(''); // 시도
    const [station, setStation] = useState(''); // 측정소

    const [sidoList, setSidoList] = useState<any[]>([]); // 시도 리스트
    const [stationList, setStationList] = useState<any[]>([]); // 측정소 리스트
    const [oneRow, setOneRow] = useState<any>([]); // 오늘의 정보 담은 행
    const [prevWeekRow, setPrevWeekRow] = useState<any>([]); // 지난주 평균 정보를 담은 행
    const [prevMonthRow, setPrevMonthRow] = useState<any>([]); // 지난달 정보를 담은 행
    const [yesterDay, setYesterDay] = useState<any>([]); // 어제 데이터 

    // 자료 가져옴
    useEffect(() => {
        // 오늘 데이터 연결
        let url = "http://kkms4001.iptime.org:21168/today";
        fetch(url)
            .then((response) => {
                if (!response.ok) { throw new Error("Network response was not ok"); }
                return response.json();
            })
            .then((data) => { setAllData(data); console.log("오늘연결완료") })
            .catch((error) => { console.log(error) }
            );

        // 이전 데이터
        const date = new Date();
        const nowYear = date.getFullYear(); // 올해 설정
        const prevMonth = date.getMonth(); // 전월 데이터
        let ze = ''; // 0설정
        if (prevMonth < 10) { ze = '0' }
        url = `http://kkms4001.iptime.org:21168/month?month=${nowYear}-${ze}${prevMonth}`; // 올해 전 달
        fetch(url)
            .then((response) => {
                if (!response.ok) { throw new Error("Network response was not ok"); }
                return response.json();
            })
            .then((data) => { setPrevMonthDatas(data); console.log("전달연결완료") })
            .catch((error) => { console.log(error) }
            );


        // 예측 데이터
        url = "http://kkms4001.iptime.org:21168/prediction";
        fetch(url)
            .then((response) => {
                if (!response.ok) { throw new Error("Network response was not ok"); }
                return response.json();
            })
            .then((data) => { setPredictionDatas(data); console.log("예측연결완료") })
            .catch((error) => { console.log(error) }
            );
    }, []);

    // 시도 리스트 설정
    useEffect(() => {
        let dataList: any[] = [];
        let query = 'SELECT DISTINCT sidoName FROM ?';

        dataList = alasql(query, [allDatas]);
        console.log("시도 리스트 설정중")
        console.log(allDatas)
        console.log(dataList)

        const list = dataList.map((item) => ({
            key: item.sidoName,
            value: item.sidoName
        }));
        setSidoList(list);
        // 처음 랜더시 나오는 데이터
        if (dataList.length > 0) {
            console.log(dataList[0]["sidoName"])
            setSido(dataList[0]["sidoName"]);
        }
    }, [allDatas]);

    // 측정소 리스트 설정 시도가 새로 설정 될시 실행됨
    useEffect(() => {
        console.log("시도 재설정됨");
        console.log(sido);
        let dataList: any[] = [];
        let query = 'SELECT * FROM ? '; // 기본
        if (sido !== '') { query += `WHERE sidoName="${sido}" ORDER BY stationName`; }

        dataList = alasql(query, [allDatas]);
        if (dataList.length > 0) {
            console.log(dataList)
            const list = dataList.map((item) => ({
                key: item.stationName,
                value: item.stationName
            }));

            if (list.length > 0) {
                setStationList(list);
            }

            const oneRow = dataList[0];
            setStation(oneRow.stationName);
            setOneRow(dataList[0]);
        }
    }, [sido]);

    // 스테이션 변경시 가져오는 값들
    useEffect(() => {
        console.log("스테이션 재설정됨");
        console.log(station);
        let dataList: any[] = [];
        let query = "SELECT * FROM ? WHERE stationName = ?";
        dataList = alasql(query, [allDatas, station]);

        if (dataList.length > 0) {
            console.log("스체시연 결과 반환")
            setOneRow(dataList[0]);

            let url = "http://kkms4001.iptime.org:21168/week?stationName=" + station;

            fetch(url)
                .then((response) => {
                    if (!response.ok) { throw new Error("Network response was not ok"); }
                    return response.json();
                })
                .then((data) => {
                    let list = [...data, dataList[0]];
                    console.log(list);
                    setPrevWeekDatas(list);
                    setYesterDay(data[data.length - 1])
                })
                .catch((error) => {
                    console.log(error)
                });

        }
        if (prevMonthDatas.length > 0) {
            let prevData: any[] = alasql(query, [prevMonthDatas, station]);
            if (prevData.length > 0) {
                console.log(prevData[0]);
                setPrevMonthRow(prevData[0]);
            }
        }
    }, [station]);

    // 해당 스테이션의 오늘 값 설정 완료 되면
    useEffect(() => {
        console.log("원로우 설정완료 전달 설정중")
        console.log(prevMonthDatas)
        let prevData: any[] = [];
        let query = "SELECT * FROM ? WHERE stationName = ?";
        prevData = alasql(query, [prevMonthDatas, station])
        if (prevData.length > 0) {
            setPrevMonthRow(prevData[0]); // 해당 스테이션 지난달 평균
        }
    }, [oneRow]);

    useEffect(() => {
        console.log("주데이터 설정됨");
        if (prevWeekDatas.length > 0) {
            let query = `SELECT 
            AVG(coValue),
            AVG(no2Value),
            AVG(o3Value),
            AVG(pm10Value),
            AVG(pm25Value),
            AVG(so2Value)
            FROM ? WHERE stationName = ?`;
            let prevWeekData: any[] = alasql(query, [prevWeekDatas, station]);
            if (prevWeekData.length > 0) {
                setPrevWeekRow((prev: any) => prevWeekData[0]); // 지난주 값 평균 데이터
            }
        }
    }, [prevWeekDatas]);

    const giveStation = (itme: any) => {
        setStation(itme);
    }

    return (
        <>
            <div className="mainContentArea" style={{ display: 'flex' }}>
                <Left
                    onStation={station}
                    getData={allDatas}
                    getOneRow={oneRow}
                    getPrevWeekRow={prevWeekRow}
                    getPrevMonthRow={prevMonthRow}
                    getYesterDay={yesterDay}
                    getPrevWeekDatas={prevWeekDatas} />

                <Center
                    onStation={station}
                    onSido={sido}
                    onSidoList={sidoList}
                    onStationList={stationList}
                    getOneRow={oneRow}
                    onSetSido={(day: string) => { console.log(day); setSido(day) }}
                    onSetStation={(reStstion: string) => { giveStation(reStstion) }}
                    onSetMode={(mode: string) => { setMode(mode) }} />

                <Right
                    getData={allDatas}
                    getOneRow={oneRow}
                    onSidoList={sidoList}
                    onStation={station}
                    getPrediction={predictionDatas}
                    getPrevWeekDatas={prevWeekDatas} />

            </div>
            <StatData
                getMode={mode}
                getData={allDatas}
                onSidoList={sidoList}
                onSetMode={(mode: string) => { setMode(mode) }} />
        </>
    )
}
export default Content;
