import React, {useState, useEffect, useRef} from 'react';
import { khiVFunc  } from "../../khiVfunc";

// function PrevAir(props: {day: String}) {
//     return <div className="forecast">
//         <h3 className='forecastTitleArea'>{props.day}</h3>
//         <div className='statusDisplay'>상태</div>
//     </div>
// }


const Returnresulet = (todayVal: number, nowKhi: any, ) =>{
    let prevMaxVa = 0;

    // if (nowKhi.length > 0) {
        console.log(nowKhi);
        for (let i = 0; i < nowKhi.length; i++) {
            if(prevMaxVa < nowKhi[i].value){
                prevMaxVa = nowKhi[i].value;
            }
        }
        console.log("전일 통합대기지수")

        console.log(prevMaxVa)
        // setPrevToday(()=>{
        // // (올해의 값 - 작년의 값) / 작년의 값 *100
        // // props.getRow["khaiValue"]
        
        let wmdrkafbf = (todayVal - prevMaxVa) / prevMaxVa * 100;
        wmdrkafbf = parseFloat( wmdrkafbf.toFixed(2) );
        let str=''
        let fontColor = "#f00"
        let uNd = ''
        if(wmdrkafbf > 0){
            console.log("높음 호출")
            str="어제보다 지수가 높움"
            fontColor="#f00";
            uNd = '▲'
        }else if(wmdrkafbf < 0){
            console.log("낮음 호출")
            str="어제보다 지수가 낮음"
            fontColor="#00f"
            uNd = '▼'
        }
        // 
        return(
            <div style={{ color: fontColor}}>
                 {wmdrkafbf}{uNd}
            </div>
        );
}









function Etc( props: any ){
    console.log(props.getRow);
    console.log(props.getPrevRow);
    const [prevToday, setPrevToday] = useState(0);
    const [showlist, setShowlist] = useState<any[]>([]);
    // let showlist: any[]=[];
    useEffect(()=>{
        setShowlist([]);
        // setRow(props.getRow);
        // setPrevDayRow(props.getPrevRow);
        const row = props.getRow;
        const prevDayRow = props.getPrevRow;
        let nowKhi: any[]=[];
        let todayVal = 0;
        if(row !== undefined){
            console.log("오늘통합대기")
            console.log( row["khaiValue"])
            todayVal = row["khaiValue"];

            // console.log(row)
        }
        for (const key in prevDayRow) {
                // console.log(key)
            if(key.includes("Value")){
                nowKhi.push(  khiVFunc( key, prevDayRow[key]) );
            }
        }
        let prevMaxVa = 0;
        if (nowKhi.length > 0) {
            console.log(nowKhi);
            for (let i = 0; i < nowKhi.length; i++) {
                if(prevMaxVa < nowKhi[i].value){
                    prevMaxVa = nowKhi[i].value;
                }
            }
            console.log("전일 통합대기지수")

            console.log(prevMaxVa)
            setPrevToday(()=>{
            // (올해의 값 - 작년의 값) / 작년의 값 *100
            // props.getRow["khaiValue"]
                const wmdrkafbf = (todayVal - prevMaxVa) / prevMaxVa * 100;
                let wkfma = parseFloat(wmdrkafbf.toFixed(2));
                return wkfma;
                // return wmdrkafbf;
            })
            // maxVa = nowKhi.value;
        }
        let list = Returnresulet( todayVal, nowKhi );
        let list2 = Returnresulet( todayVal, nowKhi );
        console.log("list")
        console.log(list)
        // showlist.push(<>{list}</>)
        setShowlist(prev => {
            const newD = Returnresulet( todayVal, nowKhi );
            return [... prev, newD]
        }
        )
        // setShowlist(prev => [... prev, <div>dmdkfdkfknenqjsWO{list2}</div>])
        // setStali( list )
        // console.log("00000000000000000000000000000000showlist")
        // console.log(showlist)


    },[props.getRow])
    return(
        <>
            <div className="forecastArea">
                {prevToday}
                {showlist}
            </div>
        </>

    )
}
export default Etc;