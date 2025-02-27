import React, { useRef, useEffect, useState, forwardRef } from "react";
import './statistics.scss';
import alasql from "alasql";
import { IoCloseSharp, IoSearch, IoPrintSharp } from "react-icons/io5";
import { useReactToPrint } from "react-to-print";

const SelectBox = (props: any) => {
    const [si, setsi] = useState(props.getSidoList[0]?.value);
    const [sta, setsta] = useState(props.getStationList[0]?.value);
    useEffect(() => {
        props.onSetSido(si);
        props.onSetStation(sta);
    }, [si])

    const chanval = (e: any) => {
        if (e.currentTarget.id == "sido") {
            setsi(e.currentTarget.value)
        } else if (e.currentTarget.id == "station") {
            setsta(e.currentTarget.value)
        }
    }
    return (
        <>
            <select name="sido" id="sido" onChange={(e) => { chanval(e) }}>
                {props.getSidoList.map((item: any) => (
                    <option key={item.key || `fallback-${item.key}`} value={item.value}>
                        {item.value}
                    </option>
                ))}
            </select>
            <select name="station" id="station" onChange={(e) => props.onSetStation(e.currentTarget.value)}>
                {props.getStationList.map((item: any, index: number) => {
                    if (!item.key) {
                        console.warn("key undefined :", item);
                    }
                    return (
                        <option key={item.key || `fallback-${index}`} value={item.value}>
                            {item.value}
                        </option>
                    );
                })}
            </select>
        </>
    )
}

const OrderToggl = (props: any) => {
    const [orderState, setOrderState] = useState<string>('asc');
    const [select, setSelect] = useState<boolean>(false);

    useEffect(() => {
        props.onSetOrder(orderState);
    }, [orderState])

    const chanVal = (id: any) => {
        if (id !== orderState) { // 아이디와 지금 상태가 같지 않다면 실행
            setOrderState(id);
            setSelect(prev => !prev);
        }
    }

    return (
        <div className="label">
            <label>
                <input type="radio" name="order" id="asc" checked={!select} onClick={(e) => chanVal(e.currentTarget.id)} />
                <span>오름차순</span>
            </label>
            <label>
                <input type="radio" name="order" id="desc" checked={select} onClick={(e) => chanVal(e.currentTarget.id)} />
                <span>내림차순</span>
            </label>
        </div>
    )
}
// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
const Table = ({ getTable, getOrder, onRef }: any) => {
    const [showList, setShowList] = useState<any[]>([])
    useEffect(() => {
        if (getTable?.length > 0) {
            let query = 'SELECT * FROM ? ORDER BY date ' + getOrder;
            let result: any[] = alasql(query, [getTable]);

            if (result?.length > 0) {
                setShowList(result);
            }
        }
    }, [getTable, getOrder]);

    return (
        <>
            <table style={{ borderCollapse: 'collapse' }} ref={onRef}>
                <thead>
                    <tr>
                        <th colSpan={7}>
                            {showList.map((item: any) => item.측정소)[0]} 측정소 대기질 데이터
                        </th>
                    </tr>
                    <tr>
                        <th>날짜</th>
                        <th>미세먼지 <br />(㎍/㎥)</th>
                        <th>초미세먼지 <br />(㎍/㎥)</th>
                        <th>오존 <br />(ppm)</th>
                        <th>이산화질소 <br />(ppm)</th>
                        <th>이산화황 <br />(ppm)</th>
                        <th>일산화탄소 <br />(ppm)</th>
                    </tr>
                </thead>
                <tbody>
                    {showList.map((item: any, index: number) => (
                        <tr key={index}>
                            <td>{item.date}</td>
                            <td>{item["미세먼지"]}</td>
                            <td>{item["초미세먼지"]}</td>
                            <td>{item["오존"]}</td>
                            <td>{item["이산화질소"]}</td>
                            <td>{item["이산화황"]}</td>
                            <td>{item["일산화탄소"]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
};

function StatData(props: any) {
    const [showMode, setShowMode] = useState<boolean>(false)
    const [sido, setSido] = useState("")
    const [sidoList, setSidoList] = useState<any[]>([])
    const [allDatas, setAllDatas] = useState([])
    const [printRows, setPrintRows] = useState([])
    const [stationList, setStationList] = useState<any[]>([])
    const [station, setStation] = useState('');

    const [prevDay, setPrevDay] = useState('');
    const [lastDay, setLastDay] = useState('');
    const [order, setOrder] = useState('desc');

    // 1월5일 이전 제한
    const MIN_DATE = "2025-01-05";

    useEffect(() => {
        if (props.getMode === 'show') {
            setShowMode(true)
        } else { setShowMode(false) }

        if (props.getData?.length > 0) { setAllDatas(props.getData); }

        if (props.onSidoList?.length > 0) { setSidoList(props.onSidoList); }
    }, [props]);

    useEffect(() => {
        if (sidoList?.length > 0) {


            let dataList: any[] = [];
            let query = 'SELECT * FROM ? WHERE sidoName = ?';

            dataList = alasql(query, [allDatas, sidoList[0].value]);
            const list = dataList.map((item) => ({
                key: item.stationName,
                value: item.stationName
            }));
            setStationList((prevList) => {
                const newList = [...new Set(list)]; // 중복 제거
                return newList;
            });

            if (dataList.length > 0) {
                setSido(dataList[0]["sidoName"])
            }
        }
    }, [sidoList]);

    useEffect(() => {
        let dataList: any[] = [];
        let query = 'SELECT * FROM ? '; // 기본
        if (sido !== '') { query += `WHERE sidoName="${sido}" `; }

        dataList = alasql(query, [allDatas]);

        if (dataList.length > 0) {
            const list = dataList.map((item) => ({
                key: item.stationName,
                value: item.stationName
            }));

            setStationList((prevList) => {
                const newList = [...new Set(list)]; // 중복 제거
                return newList;
            });

            setStation(list[0].key);
        }
    }, [sido]);

    useEffect(() => {
        console.log("stationList 변경")
    }, [stationList]);

    const reQuest = () => {
        let url = `statics?s=${prevDay || MIN_DATE}&e=${lastDay}&stationName=${station}`;
        fetch(url)
            .then((response) => {
                if (!response.ok) { throw new Error("Network response was not ok"); }
                return response.json();
            })
            .then((data) => { setPrintRows(data); })
            .catch((error) => { console.log(error) }
        );
    }

    const contentRef = useRef<HTMLTableElement>(null!)
    const printBtn = useReactToPrint({ contentRef });

    return (
        <div className='statisics' style={showMode ? { display: "block" } : { display: "none" }}>

            <div className="listSky" >
                <div className="listTitle">
                    <h2>수도권 대기 정보 통계</h2>
                    <button type="button" className="listClose" onClick={() => { props.onSetMode("close") }}><IoCloseSharp /></button>
                </div>

                <div className="dataNotice">
                    <p style={{ margin: 0 }}>
                        <strong>안내:</strong> 2025년 1월 5일 이전의 데이터는 제공되지 않습니다.
                    </p>
                </div>

                <div className='selectArea'>
                    <div className='locationSearch'>
                        <span>지역 검색</span>
                        <SelectBox
                            getSidoList={sidoList}
                            onSetSido={(day: string) => { console.log(day); setSido(day) }}
                            getStationList={stationList}
                            onSetStation={(day: string) => setStation(day)}
                        />
                    </div>
                    <div className='timeSearch'>
                        <span>조회 기간</span>
                        <input
                            type="date"
                            name="prev"
                            id="prev"
                            min={MIN_DATE}
                            onChange={e => setPrevDay(e.currentTarget.value)}
                        />
                        <input
                            type="date"
                            name="now"
                            id="now"
                            onChange={e => setLastDay(e.currentTarget.value)}
                        />
                        <button type="button" onClick={() => reQuest()}> <IoSearch /> </button>
                        <OrderToggl onSetOrder={(value: string) => setOrder(value)} />
                    </div>
                </div>
                <div className='listTable'>
                    <h3>{station} 측정소 대기질 정보표 데이터</h3>
                    <div className="listData">
                        <Table getTable={printRows} getOrder={order} onRef={contentRef} />
                    </div>
                    <button type="button" onClick={() => { console.log(contentRef); printBtn() }}><IoPrintSharp /></button>
                </div>
            </div>
        </div>
    )
}

export default StatData