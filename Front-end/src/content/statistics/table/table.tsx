import React, { useRef, useEffect, useState, forwardRef } from "react";
import alasql from "alasql";


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


export default Table;