import React, {useState, useEffect, useRef} from 'react';
import alasql from "alasql";
import { IoCloseSharp, IoSearch } from "react-icons/io5";

import './popup.scss'




// const toggl =()=>{
//     let select=true;

//     const asc = useRef(null)
//     const desc = useRef(null)



//     return(
//         <>
//             <label>
//             <input type="radio" name="order" id="desc" checked={select} ref={desc} onClick={(e)=>chanVal(e.currentTarget.id)}/>
//                 내림차순
//             </label>
//             <label>
//             <input type="radio" name="order" id="desc" checked={!select} ref={asc} onClick={(e)=>chanVal(e.currentTarget.id)}/>
//                 오름차순
//             </label>
//         </>
//     )
// }


const Popup=(props: any)=>{
    
    const [showMode, setShowMode] = useState<boolean>(false)
    const [show, setShow] = useState<any>('')
    const [sido, setSido] = useState("")
    const [sidoList, setSidoList] = useState<any[]>(props.onSidoList)
    const [allDatas, setAllDatas] = useState([])
    const [printRows, setPrintRows] = useState([])
    const [stationList, setStationList] = useState<any[]>([])
    const [station, setStation] = useState('');
    

    const [prevDay, setPrevDay] = useState('');
    const [lastDay, setLastDay] = useState('');
    const [order, setOrder] = useState('desc');
    const searchBtn = useRef(null)
    // getData={ allDatas }





    useEffect(()=>{
        console.log("popup file props check");
        console.log(props)
        if(props.getMode == 'show'){
            setShowMode( true )
        }else{
            setShowMode(false)
        }
        if(props.getData?.length > 0){
            setAllDatas(props.getData);
        }
        if(props.onSidoList?.length > 0){
            // console.log("시 도를 가져와라 왜 못가져 오는데 ㅠㅠprops.onSidoList")
            setSidoList(props.onSidoList);
        }
    },[props]);

    // useEffect(()=>{
    //     console.log("popup file props check");
    //     console.log(props)
    //     if(props.getMode == 'show'){
    //         setShowMode( true )
    //     }else{
    //         setShowMode(false)
    //     }
    // },[props.getMode]);

    // useEffect(() => {
    //     if(props.getData?.length > 0){
    //         setAllDatas(props.getData);
    //     }
    // }, [props.getData]);


    useEffect(() => {
        console.log(sidoList)
        if (sidoList?.length > 0) {
            
        console.log(sidoList[0].value)

        let dataList: any[] = [];
            let query = 'SELECT * FROM ? WHERE sidoName = ?';
            console.log(allDatas)
            
            dataList = alasql(query,[allDatas, sidoList[0].value]);

            // console.log("daskldljfgklajzsdljfaldskjflkdsj")

            // console.log(allDatas)
            // console.log(dataList)

            const list = dataList.map((item) => ({
                key: item.stationName,
                value: item.stationName
            }));
            console.log(list)
            setStationList((prevList) => {
                const newList = [...new Set(list)]; // 중복 제거
                // console.log("중복 제거 후 리스트:", newList);
                return newList;
            });
            // setStationList( prev => list);

            // 처음 랜더시 나오는 데이터
            if (dataList.length > 0) { 
                setSido(dataList[0]["sidoName"])
            }
        }
    }, [sidoList]);
    
    // 측정소 리스트 설정 시도가 새로 설정 될시 실행됨
    useEffect(() => {
        console.log( "시도" );
    //     console.log( sido );
        console.log( sidoList );

        let dataList: any[] = [];
        let query = 'SELECT * FROM ? '; // 기본
        if(sido !== ''){
            query+=`WHERE sidoName="${sido}" `; // ORDER BY stationName`;
        }
        dataList = alasql(query,[allDatas]) ;

        // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
        if(dataList.length>0){
            const list = dataList.map((item) => ({
                key: item.stationName,
                value: item.stationName
            }));

            setStationList((prevList) => {
                const newList = [...new Set(list)]; // 중복 제거
                // console.log("중복 제거 후 리스트:", newList);
                return newList;
            });
            // setStationList(prev => list );
            setStation( list[0].key );

        }
        // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
    }, [sido]);

    useEffect(() => {
        console.log(stationList)
    }, [stationList]);

    // 스테이션 변경시 가져오는 값들
    // useEffect(() => {
    //     // console.log( "스테이션 설정됨" );
    //     // console.log( station );

    //     let dataList: any[] = [];
    //     let query = "SELECT * FROM ? WHERE stationName = ?";
    //     dataList = alasql(query, [allDatas, station]) ;

    //     if (dataList.length > 0 ) {
    //         // console.log( " 스테이션 설정후 뜨는 로고 오늘의 데이터를 가져옴 " );
    //         // console.log( "오늘의 데이터를 가져왔습니다." );
    //         // console.log( dataList[0] );
    //         // 해당 스테이션의 오늘 값 설정
    //         setOneRow( dataList[0] );

    //         let url = "/week?stationName="+station;
    //         fetch(url)
    //             .then((response) => {
    //             if (!response.ok) {
    //                 throw new Error("Network response was not ok");
    //             }
    //             return response.json();
    //             })
    //             .then((data) => {
    //                 console.log("이전 7(6+오늘)일 연결완료");
    //                 let list = [... data, dataList[0]];
    //                 // console.log(list)
    //                 setPrevWeekDatas( list );
    //                 setYesterDay(data[data.length-1])
    //             })
    //             .catch((error) => {
    //             console.log(error)
    //         });
            
    //     }
    //     if (prevMonthDatas.length > 0) {    
    //         let prevData: any[] = alasql(query, [prevMonthDatas, station]);

    //         if (prevData.length > 0) {
    //             console.log( prevData[0] );
    //             setPrevMonthRow( prevData[0] ); 
    //         }
    //     }
    // }, [station]);

    // // 해당 스테이션의 오늘 값 설정 완료 되면
    // useEffect(() => {
    //     let prevData: any[] = [];
    //     let query = "SELECT * FROM ? WHERE stationName = ?";
    //     prevData = alasql(query, [prevMonthDatas, station])
    //     if(prevData.length > 0){
    //         // console.log( "지난 달 데이터를 가져왔습니다." );
    //         // console.log(  prevData[0] )
    //         setPrevMonthRow( prevData[0] ); // 해당 스테이션 지난달 평균
    //     }
    // }, [oneRow]);
    // 지난달 데이터를 가져오고
    // 지난달 데이터가 설정되면 // 주 값 가져옴
    
    
    // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
    // useEffect(()=>{
       
    //     if(prevWeekDatas.length > 0){
    //         // console.log( "지난주 데이터 테이블이 생성되었습니다." );
    //         // console.log(prevWeekDatas);

    //         let query = `SELECT 
    //         AVG(coValue),
    //         AVG(no2Value),
    //         AVG(o3Value),
    //         AVG(pm10Value),
    //         AVG(pm25Value),
    //         AVG(so2Value)
    //         FROM ? WHERE stationName = ?`;
    //         let prevWeekData: any[] = alasql(query, [prevWeekDatas, station]);
    //         if(prevWeekData.length > 0){
    //             setPrevWeekRow((prev: any) => prevWeekData[0] ); // 지난주 값 평균 데이터
    //         }
    //     }
    // },[prevWeekDatas]);
    // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ


    // useEffect(() => {

    //     console.log(prevDay, lastDay, searchBtn.current)
    // }, [prevDay.current, lastDay, searchBtn.current]);




    useEffect(() => {
        if(printRows?.length > 0){
            console.log( "출력을 위한 값 설정 완료" );
            console.log( printRows);
                let check = printRows.sort()
                console.log(check)

            }
            let query = 'SELECT * FROM ? ORDER BY date '+order;
            const result = alasql(query, [printRows]);
            // if(result?.length>0){
                console.log(result);

            // }
            // }
            // dataList = alasql(query,[allDatas]) ;

    }, [printRows]);

    const reQuest=()=>{
        // /statics?s=2025-01-26&e=2025-02-20&stationName=%EC%A4%91%EA%B5%AC
        
        let url = `statics?s=${prevDay}&e=${lastDay}&stationName=${station}`;
        console.log(url);
        fetch(url)
            .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
            })
            .then((data) => {
                console.log("출력용 데이터 연결완료");
                console.log(data);
                // console.log("이전 7(6+오늘)일 연결완료");
                // let list = [... data, dataList[0]];
                // // console.log(list)
                // setPrevWeekDatas( list );
                // setYesterDay(data[data.length-1])
                setPrintRows(data);
            })
            .catch((error) => {
            console.log(error)
        });

    }
    const d = 
        <>
            <select name="sido" id="sido" onChange={(e) => setSido(e.currentTarget.value)}>
                {/* {console.log(sidoList)} */}
                {sidoList.map((item: any) => (
                    <option key={item.key || `fallback-${item.key}`} value={item.value}>
                        {item.value}
                    </option>
                ))}
            </select>
            <select name="station" id="station" onChange={(e) => setStation(e.currentTarget.value)}>
                {/* {stationList.map((item) => (
                    <option key={item.key} value={item.value}>
                        {item.value}
                    </option>
                ))} */}
                {stationList.map((item: any, index: number) => {
                    if (!item.key) {
                        console.warn("🚨 key가 undefined인 아이템 발견:", item);
                    }
                    return (
                        <option key={item.key || `fallback-${index}`} value={item.value}>
                            {item.value}
                        </option>
                    );
                })}
            </select>
        </>
    

    return( 
        <>
            <div className="popModalArea"
            style={ showMode ? {display: "block"}: {display: "none"}}>
                1234
                {props.getMode}
                {d}
                {show}
                <button type="button" onClick={ () => props.onSetMode("close")  }><IoCloseSharp /></button>

                <input type="date" name="prev" id="prev" onChange={ e => setPrevDay(e.currentTarget.value)} />
                <input type="date" name="now" id="now"onChange={ e => setLastDay(e.currentTarget.value)}/>
                <button type="button"
                 onClick={ ()=> reQuest()  }
                    >
                       <IoSearch />
                    </button>
            
            </div>
        </>
    )
}
export default Popup;
