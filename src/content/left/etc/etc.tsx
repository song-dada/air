import React, {useState, useEffect, useRef} from 'react';
import { khaiVFunc  } from "../../khaiVfunc";
import './etc.scss';

const Returnresulet = (todayVal: number, prevList: any, contrast: string ) =>{
    let prevMaxVa = 0;
        let localPrev: any[] = prevList?.filter((item: any)=> item !== null)
        for (let i = 0; i <  localPrev.length; i++) {
            if(prevMaxVa <  localPrev[i].value){
                prevMaxVa =  localPrev[i].value;
            }
        }
        let str=''
        let fontColor = "#f00"
        let uNd = ''
        let khai = (todayVal - prevMaxVa) / prevMaxVa * 100;
        khai = parseFloat( khai.toFixed(2) );
        if(khai > 0){
            str=`${contrast} 보다 지수가 높음`
            // str=`${contrast} 보다 지수가 높습니다.`
            fontColor="#f00";
            uNd = '▲'
            if(khai == Infinity){
                khai=0.0;
                str=`${contrast} 와/과 0% 이하의 차이`
                // str=`${contrast} 와/과 0% 이하의 차이를 보이고 있습니다.`
                fontColor="#ddd";
                uNd = '-'
            }
        }else if(khai < 0){
            str=`${contrast} 보다 지수가 낮음`
            // str=`${contrast} 보다 지수가 낮습니다.`

            fontColor="#00f"
            uNd = '▼'
            if( khai == -100){
                str="측정소 오류"
                // str="측정소 오류로인해 값을 받아올수 없습니다."
                fontColor="#000"
                uNd = ' - '
            }
        }
        // 
        return(
            <div className='etc' style={{ color: fontColor}}>
                <h3>{contrast} 대비 증감율</h3>
                <div className='etcV'>
                    <div>{khai} {uNd}</div>
                    <p>{str}</p>
                </div>
            </div>
        );
}


function Etc( props: any ){
    const [showlist, setShowlist] = useState<any[]>([]);
    useEffect(()=>{
        
        setShowlist([]);

        const row = props.getOneRow;
        const prevWeekRow = props.getPrevWeekRow;
        const prevMonthRow = props.getPrevMonthRow;

        let pWv: any[]=[];
        let todayVal = 0;
        if(row !== undefined){
            todayVal = row["khaiValue"];
        }

        if(prevWeekRow !== undefined){
            // 전 주
            for (const key in prevWeekRow) {
                    // console.log(key)
                if(key.includes("Value")){
                    const val = khaiVFunc( key, prevWeekRow[key])
                    pWv.push( val );
                }
            }
        }
        let pMv: any[]=[];
        if (prevMonthRow !== undefined) {
            // 전 달
            for (const key in prevMonthRow) {
                // console.log(key)
                const val = khaiVFunc( key, prevMonthRow[key])
                pMv.push( val );
            }
            
        }
        if(row !== undefined && prevWeekRow !== undefined && prevMonthRow !== undefined){
            setShowlist(prev => {
                const newD = Returnresulet( todayVal, pWv, '지난주' ); // 전 주
                const newD2 = Returnresulet( todayVal, pMv, '지난달' ); // 전 달
                return [newD, newD2];
            })

        }
    
    },[props.getRow, props.getPrevRow, props.getPrevMonthRow])

    return(
        <>
            <div className="etcArea"> 
                <div className='etcA'>{showlist}</div>
            </div>
        </>

    )
}
export default Etc;