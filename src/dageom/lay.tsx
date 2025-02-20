import React, {useState, useEffect, useRef} from 'react';
import './sass/lay.scss';
import RestA from './rest/test';
import CircleP from './gpt/circle';
import Info from '../da2/info';
import { IoMdArrowRoundBack } from "react-icons/io";
import alasql from "alasql";


type ClickProps = {
    chaState: (id: string) => void; // 문자열을 인수로 받는 함수 타입
    getRef: () => void;
    giveData: any[];
  };

// // function DetailInfo( {onShow, onClose}:any ) {
// //     const showObj = useRef<HTMLDivElement | null>(null);
// //     useEffect(()=>{
// //         let showDiv = showObj.current;
// //         if(showDiv){
// //             showDiv.style.top = onShow;
// //         }
// //     },[onShow]);
// //     return(
// //         <div className={`detailInfo`} ref={showObj}>
// //             일단 이게 위로 올라오고 내려오는???
// //             <button type="button" className="closeBtn" onClick={()=> onClose() }>close</button>
// //             <LegendRow/>
// //         </div>
// //     )
// // }
// // function InfoItem({sjarla}:any):any {
// //     console.log(sjarla);
// //     const data:any = null;
// //     return(
// //         <>
// //             <div className="infoItem">
// //                 {/* <progress id={"PM25"} value={'null'} max={1}></progress>
// //                 <progress value={data} /> */}
// //                 {/* <div className="progress-container">
// //                     <div className="progress-background" />
// //                     <div
// //                         className="progress-bar"
// //                         style={{ transform: `rotate(${(percentage / 100) * 180 - 90}deg)` }}
// //                     />
// //                     <div className="progress-text">{percentage}%</div>
// //                 </div> */}
// //                 <CircleP onOneRow={ sjarla }/>
// //             </div>
// //         </>
// //     )
// // }
// // function Info( {onMode, onOneRow }:any ) {
// //     const [show, setShow] = useState<string>('100%');
// //     const upNdown=()=>{
// //         let up = '0';
// //         let down = '100%'
// //         setShow( (prev) => {
// //             if(prev === up){
// //                 return down;
// //             }else{
// //                 return up;
// //             }
// //         });
// //     };
// //     const close=()=>{
// //         setShow( (prev) => {
// //             return '100%';
// //         });
// //     }
// //     if(!onMode){
// //         return null;
// //     }
// //     else{
// //         return(
// //             <>
// //                 <div className={`infoA ${onMode}`}>
// //                     <div className="address">
// //                         <div>
// //                             <h2>지역 지역</h2>
// //                             <h3>날짜 날짜</h3>
// //                             <p>세부지역 위치는 어디라고 해야하지</p>

// //                         </div>
// //                         <button type="button"><IoMdArrowRoundBack /></button>
// //                     </div>
// //                     <div className={`info`}>
// //                     <h3>오늘의 미세먼지</h3>
// //                         <InfoItem sjarla={onOneRow}></InfoItem>
// //                         {/* <div className="infoItem" onClick={ ()=> { upNdown(); } }> 데이터 1 </div> */}
// //                         <div className="infoItem" onClick={ ()=> { upNdown(); } }> 데이터 2 </div>
// //                     <h3>오늘의 대기질</h3>
// //                         <div className="infoItem" onClick={ ()=> { upNdown(); } }> 데이터 3 </div>
// //                         <div className="infoItem" onClick={ ()=> { upNdown(); } }> 데이터 4 </div>
// //                         <div className="infoItem" onClick={ ()=> { upNdown(); } }> 데이터 5 </div>
// //                         <div className="infoItem" onClick={ ()=> { upNdown(); } }> 데이터 6 </div>
// //                     </div>
// //                     {/* <div className="legend">범례</div> */}
// //                     <LegendRow/>
// //                     <DetailInfo onShow={show} onClose={ close }/>
// //                 </div>
            
// //             </>
// //         )
// //     }
// // }
// // function LegendRow(){
//     return(
//         <>
//             <div className="legend">범례</div>

//         </>

//     )
// }
function View( {onMode}:any ) {
    if(!onMode){
        return null;
    }
    else{
        return(
            <>
                <div className={`view ${onMode}`}>

                    <div className="alertArea">
                        <div className="alert">미세먼지 경보</div>
                        <div className="alert">초미세먼지 경보</div>
                        <div className="alert doit">행동 요령</div>
                        
                    </div>
                    <div className="radarArea">
                        <div className="graphBar">범례</div>
                        <div className="nowMap">현재 대기질</div>
                        <div className="prevMap">예상 대기질</div>
                    </div>
                </div>
            
            </>
        )
    }
}
function Click( {chaState, getRef, giveData}: ClickProps ) {
    let dataList: any[] = [];
    let viewList: any[] = [];
    if( giveData && giveData.length > 0 ){
        let qurey = 'SELECT DISTINCT sidoName FROM ?';
        dataList = alasql(qurey,[giveData]) ;

        for (const element of dataList) {
            const item = element;
            for (const key in item) {
                viewList.push(
                    <button type='button' className={key} value={item[key]}
                    onClick={ (e)=>{ alert(e.currentTarget.value ) }} >
                        {item[key]}
                    </button>
                );
            }
        }
    }
    
    return(
        <>
            <div className="click" id="click" ref={getRef}
            onClick={ (e)=>{ chaState( e.currentTarget.id ) } }>
                클릭 지도
                { viewList }
            </div>
        </>
    )
    
}
function Header({ onSelect }: any) {
    return(
        <header>
            로고, 메뉴, 셀렉트 박스
            {onSelect}
        </header>
    )
}
function Footer() {
    return(
        <footer>
            (C) 2025-03 CleanSky
        </footer>
    )
}
function Main() {
    const [mode, setMode] = useState(true);
    const [state, setState] = useState({});
    // const [loading, setLoading] = useState<boolean>(true);
    // const [error, setError] = useState<string | null>(null);
    const block1:any = useRef(null);
    const block2:any = useRef(null);
    const block3:any = useRef(null);
    const folder = ( id: String ) => {
        // console.log(1234);
        setMode((prev) => !prev)
    }
    const [showList, setShowList] = useState<any[]>([]);
    const [datas, setData] = useState<any[]>([]);

    const [allDatas, setAllData] = useState<any[]>([]);
    const [sido, setSido] = useState('');
    const [station, setStation] = useState('');

    const [sidoList, setSidoList] =  useState<any[]>([]);
    const [stationList, setStationList] = useState<any[]>([])
    const [oneRow, setOneRow] = useState<any>([])

    useEffect(() => {
        let url = "http://localhost:4000/sample";
        
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
        <>
            <div id="layout" className="layout">
                <Header onSelect={d}/>
                <body>
                    <div className="center">
                        <Click getRef={ block1 } chaState={( id: String )=>{ folder(id) }} giveData={allDatas}/>
                        <View getRef={ block2 } onMode={ mode }/>
                        <Info  getRef={ block3 } onMode={ !mode } onOneRow={oneRow !== undefined ? oneRow : null}/>

                    </div>
                    {/* <select name="sido" id="sido" onChange={(e) => setSido(e.currentTarget.value)}>
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
                    </select> */}
                    {d}
                </body>
                <Footer/>
            </div>


        </>
    )
}
export default Main
