import React, {useState, useEffect, useRef} from 'react';
import alasql from "alasql";

import Left from './left/left';
import Center from './center/center';
import Right from './right/right';
// import { IoMdArrowRoundBack } from "react-icons/io";
// dageom

function Content() {
    const [showList, setShowList] = useState<any[]>([]);
    const [datas, setData] = useState<any[]>([]);

    const [allDatas, setAllData] = useState<any[]>([]);
    const [prevMonthDatas, setPrevMonthDatas] = useState<any[]>([]);
    const [sido, setSido] = useState('');
    const [station, setStation] = useState('');

    const [sidoList, setSidoList] =  useState<any[]>([]);
    const [stationList, setStationList] = useState<any[]>([])
    const [oneRow, setOneRow] = useState<any>([])
    const [prevOneRow, setPrevOneRow] = useState<any>([])

    // 자료 가져옴
    useEffect(() => {
        // let url = "http://localhost:4000/sample";
        let url = "/day?day=2025-02-21";
        // http://kkms4001.iptime.org:21168/day?day=2025-02-21
        
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

        // 전월 데이터
        // url = "http://localhost:4000/sampleMonth";
        url = "/month?date=2024-02";
        // http://kkms4001.iptime.org:21168/month?date=2024-02
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            //   console.log(data)
            setPrevMonthDatas(data);
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
            
            // 처음 랜더시 나오는 데이터
            if (dataList.length > 0) {
                // let ddho = dataList[0]["sidoName"]
                // console.log( ddho );
                setSido(dataList[0]["sidoName"])
                
            }
            setSidoList(()=> list );
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


        qurey = 'SELECT * FROM ?'; // 기본
        if(sido !== ''){
            qurey+=`WHERE sidoName="${sido}" LIMIT 1`;
        }
        dataList = alasql(qurey,[allDatas]);

        // console.log( "dataList" );

        // const oneRow = dataList[0];
        // console.log( oneRow );
        setOneRow( dataList[0]);


        // console.log( prevMonthDatas );

        if(dataList.length > 0){
            let prevStation = dataList[0]["stationName"];
            qurey = 'SELECT * FROM ?'; // 기본
            qurey+=`WHERE stationName="${prevStation}"`;
    
            let prevData: any[] = []
            prevData = alasql(qurey, [prevMonthDatas])
            setPrevOneRow( prevData[0] );

        }


    }, [sido]);

    // 한행 설정 세부2로 넘길수 있으려나
    useEffect(() => {
        console.log( station );

        let dataList: any[] = [];
        let qurey = 'SELECT * FROM ? '; // 기본
        // if(sido !== ''){
            qurey+=`WHERE stationName="${station}"`;
        // }
        dataList = alasql(qurey, [allDatas]) ;
        // console.log( "이 아래 나오는게 쿼리 결과" );
        // console.log( dataList[0] );
        setOneRow( dataList[0] );
        if(dataList.length > 0){
            let addrss = dataList[0].addr;
            qurey = 'SELECT * FROM ? '; // 기본
            qurey+=`WHERE addr="${addrss}"`;

            let prevData: any[] = []
            prevData = alasql(qurey, [prevMonthDatas])
            setPrevOneRow( prevData[0] );
        }
        // const oneRow = dataList[0]; 
        // console.log( oneRow );
        // qurey = 'SELECT * FROM ? '; // 기본
        // // if(sido !== ''){
        //     qurey+=`WHERE stationName="${station}"`;
        // let prevData: any[] = []
        // prevData = alasql(qurey, [prevMonthDatas])
        // setPrevOneRow( prevData[0] );
        // console.log( "이 아래 나오는게 쿼리 결과" );
        // console.log( prevData );

    }, [station]);
    // (올해의 값 - 작년의 값) / 작년의 값 *100
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

    const giveStation=( itme: any)=>{
        setStation(itme);
    }
    return(
        <>
        <div className="didid" style={{display: 'flex'}}>
            <Left getData={ allDatas } getOneRow={ oneRow } getPrevRow={ prevOneRow }/>
            <Center findSido={sidoList}
            // onSetSido={( reSido: string )=>{
            //     console.log("부모에서 받아옴 ");
            //     console.log(reSido);
            //     setSido( prev => reSido);

            // }} 
            onSetStation={( reStstion: string )=>{
                // console.log("부모에서 받아옴 ");
                // console.log(reStstion);
                //setStation( reStstion)}
                giveStation( reStstion) } }
            // onReturnRow={ (item:any) => resultRow(item) }
            />
            <Right getOneRow={ oneRow }/>

        </div>
            {d}

        </>
    )
}
export default Content;