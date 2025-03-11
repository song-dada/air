import React, { useState, useEffect, useRef } from 'react';
import { khaiVFunc } from "../../khaiVfunc";
// import './etc.scss';

const Returnresulet = (todayVal: number, prevList: any, contrast: string) => {
    let prevMaxVa = 0;
    let localPrev: any[] = prevList?.filter((item: any) => item !== null)
    for (let i = 0; i < localPrev.length; i++) {
        if (prevMaxVa < localPrev[i].value) {
            prevMaxVa = localPrev[i].value;
        }
    }
    let str = '', fontColor = "#f00", uNd = '';
    let khai = (todayVal - prevMaxVa) / prevMaxVa * 100;
    khai = parseFloat(khai.toFixed(2));
    if (khai > 0) {
        str = `${contrast}보다 지수가 높음`
        fontColor = "#FF595E"; uNd = '▲';
        if (khai == Infinity) {
            khai = 0.0;
            str = `${contrast}와/과 0% 이하 차이`;
            fontColor = "#ddd"; uNd = '-';
        }
    } else if (khai < 0) {
        str = `${contrast}보다 지수가 낮음`
        fontColor = "#3F8EF5"; uNd = '▼';
        if (khai == -100) {
            str = "측정소 오류"; fontColor = "#333"; uNd = ' - ';
        }
    }
    return (
        <div className='etc' style={{ color: fontColor }}>
            <h3>{contrast} 대비 증감율</h3>
            <div className='etcV'>
                <div>{khai} {uNd}</div>
                <p>{str}</p>
            </div>
        </div>
    );
}


const ChangeRate = (props: any) => {
    const [showlist, setShowlist] = useState<any[]>([]);
    useEffect(() => {
        console.log(props)
        setShowlist([]);

        const row = props.getOneRow;
        const yesterDayRow = props.getYesterDayRow;
        const prevWeekRow = props.getPrevWeekRow;
        const prevMonthRow = props.getPrevMonthRow;

        let todayVal = 0;
        if (row !== undefined) {
            todayVal = row["khaiValue"];
        }

        // 어 제
        let pYv: any[] = [];
        if (yesterDayRow !== undefined) {
            for (const key in yesterDayRow) {
                if (key.includes("Value")) {
                    const val = khaiVFunc(key, yesterDayRow[key])
                    pYv.push(val);
                }
            }
        }

        // 전 주
        let pWv: any[] = [];
        if (prevWeekRow !== undefined) {
            for (const key in prevWeekRow) {
                if (key.includes("Value")) {
                    const val = khaiVFunc(key, prevWeekRow[key])
                    pWv.push(val);
                }
            }
        }
        // 전 달
        let pMv: any[] = [];
        if (prevMonthRow !== undefined) {
            for (const key in prevMonthRow) {
                const val = khaiVFunc(key, prevMonthRow[key])
                pMv.push(val);
            }

        }
        if (row !== undefined && prevWeekRow !== undefined && prevMonthRow !== undefined) {
            setShowlist(prev => {
                const newY = Returnresulet(todayVal, pYv, '어제'); // 어 제
                const newW = Returnresulet(todayVal, pWv, '지난주'); // 전 주
                const newM = Returnresulet(todayVal, pMv, '지난달'); // 전 달
                return [newY, newW, newM];
            })
        }
    }, [props.getRow, props.getPrevWeekRow, props.getPrevMonthRow, props.onStation, props.getYesterDayRow])

    return (
        <>
            <div className="etcArea">
                <div className='etcA'>{showlist}</div>
            </div>
        </>
    )
}
export default ChangeRate;