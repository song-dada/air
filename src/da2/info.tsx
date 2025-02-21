import React, {useState, useEffect, useRef} from 'react';
// import './sass/lay.scss';
import CircleP from './circle';
import { IoMdArrowRoundBack } from "react-icons/io";
import LegendRow from './legendRow';


function DetailInfo( {onShow, onClose}:any ) {
    const showObj = useRef<HTMLDivElement | null>(null);
    useEffect(()=>{
        let showDiv = showObj.current;
        if(showDiv){
            showDiv.style.top = onShow;
        }
    },[onShow]);
    return(
        <div className={`detailInfo`} ref={showObj}>
            일단 이게 위로 올라오고 내려오는???
            <button type="button" className="closeBtn" onClick={()=> onClose() }>close</button>
            <LegendRow/>
        </div>
    )
}
function InfoItem({sjarla}:any):any {
    console.log(sjarla);
    const data:any = null;
    return(
        <>
            <div className="infoItem">
                <CircleP onOneRow={ sjarla }/>
            </div>
        </>
    )
}
function Info( {onMode, onOneRow, nowSido, nowStation }:any ) {
    console.log(onOneRow);
    const [show, setShow] = useState<string>('100%');
    const upNdown=()=>{
        let up = '0';
        let down = '100%'
        setShow( (prev) => {
            if(prev === up){
                return down;
            }else{
                return up;
            }
        });
    };
    const close=()=>{
        setShow( (prev) => {
            return '100%';
        });
    }
    if(!onMode){
        return null;
    }
    else{
        return(
            <>
                <div className={`infoA ${onMode}`}>
                    <div className="address">
                        <div>
                            <h2>{nowSido} {nowStation}</h2>
                            {/* <h3>날짜 날짜</h3> */}
                            <p>{onOneRow?.addr}</p>
                        </div>
                        <button type="button"><IoMdArrowRoundBack /></button>
                    </div>
                        <InfoItem sjarla={onOneRow} onEvent={ upNdown }></InfoItem>
                     
                    <LegendRow/>
                    <DetailInfo onShow={show} onClose={ close }/>
                </div>
            
            </>
        )
    }
}
// function LegendRow(){
//     return(
//         <>
//             <div className="legend">범례</div>

//         </>

//     )
// }

export default Info;