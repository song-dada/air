import React, {useState, useEffect, useRef} from 'react';
import { khiVFunc  } from "../../khiVfunc";

function Etc( props: any ){
    console.log(props.getRow);
    console.log(props.getPrevRow);
    const [row, setRow] = useState(props.getRow);
    const [prevDayRow, setPrevDayRow] = useState(props.getRow);
    const [qlryrkqt, setqlryrkqt] = useState(0);
    useEffect(()=>{
        setRow(props.getRow);
        setPrevDayRow(props.getPrevRow);
        // const prevDayRow = props.getPrevRow;
        // console.log(row)
        let nowKhi: any[]=[];
        // const row = props.getRow;
        let todayVal = 0;
        if(row !== undefined){
            console.log("오늘통합대기")
            console.log( row["khaiValue"])
            todayVal = row["khaiValue"];

        }
        for (const key in prevDayRow) {
                console.log(key)
            if(key.includes("Value")){
                // console.log(prevDayRow[key])
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
            setqlryrkqt(()=>{
            // (올해의 값 - 작년의 값) / 작년의 값 *100
            // props.getRow["khaiValue"]
            const wmdrkafbf = (todayVal - prevMaxVa) / prevMaxVa * 100
                return wmdrkafbf;
            })
            // maxVa = nowKhi.value;
        }

    },[props, row])
    return(
        <>
         기타 영역
        {qlryrkqt}
        </>

    )
}
export default Etc;