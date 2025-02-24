import React, {useState, useEffect, useRef} from 'react';
import { khiVFunc  } from "../../khiVfunc";

function Etc( props: any ){
    console.log(props.getPrevRow);
    const [row, setRow] = useState(props.getRow);
    useEffect(()=>{
        // console.log(row)
        let nowKhi: any[]=[];
        // const row = props.getRow;
        for (const key in row) {
            if(props.getRow[key].includes("Value")){
                // console.log(key)
            }
            nowKhi.push(  khiVFunc( key, props.getRow[key] ) );
        }
        let maxVa = 0;
        if (nowKhi.length > 0) {
            // console.log(nowKhi);
            // maxVa = nowKhi.value;
        }

    },[props])
    return(
        <>
         기타 영역

        </>

    )
}
export default Etc;