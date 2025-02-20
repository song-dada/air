import React, {useState, useEffect, useRef} from 'react';
// import './sass/lay.scss';
import CircleP from '../dageom/gpt/circle';
import { IoMdArrowRoundBack } from "react-icons/io";


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
            {/* <LegendRow/> */}
        </div>
    )
}
function InfoItem({sjarla}:any):any {
    console.log(sjarla);
    const data:any = null;
    return(
        <>
            <div className="infoItem">
                {/* <progress id={"PM25"} value={'null'} max={1}></progress>
                <progress value={data} /> */}
                {/* <div className="progress-container">
                    <div className="progress-background" />
                    <div
                        className="progress-bar"
                        style={{ transform: `rotate(${(percentage / 100) * 180 - 90}deg)` }}
                    />
                    <div className="progress-text">{percentage}%</div>
                </div> */}
                <CircleP onOneRow={ sjarla }/>
            </div>
        </>
    )
}
function Info( {onMode, onOneRow }:any ) {
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
    // if(onMode){
    //     return null;
    // }
    // else{
        return(
            <>
                <div className={`infoA ${onMode}`}>
                    <div className="address">
                        <div>
                            <h2>지역 지역</h2>
                            <h3>날짜 날짜</h3>
                            <p>세부지역 위치는 어디라고 해야하지</p>

                        </div>
                        <button type="button"><IoMdArrowRoundBack /></button>
                    </div>
                    <div className={`info`}>
                    <h3>오늘의 미세먼지</h3>
                        <InfoItem sjarla={onOneRow}></InfoItem>
                        {/* <div className="infoItem" onClick={ ()=> { upNdown(); } }> 데이터 1 </div> */}
                        <div className="infoItem" onClick={ ()=> { upNdown(); } }> 데이터 2 </div>
                    <h3>오늘의 대기질</h3>
                        <div className="infoItem" onClick={ ()=> { upNdown(); } }> 데이터 3 </div>
                        <div className="infoItem" onClick={ ()=> { upNdown(); } }> 데이터 4 </div>
                        <div className="infoItem" onClick={ ()=> { upNdown(); } }> 데이터 5 </div>
                        <div className="infoItem" onClick={ ()=> { upNdown(); } }> 데이터 6 </div>
                    </div>
                    {/* <div className="legend">범례</div> */}
                    {/* <LegendRow/> */}
                    <DetailInfo onShow={show} onClose={ close }/>
                </div>
            
            </>
        )
    // }
}
// function LegendRow(){
//     return(
//         <>
//             <div className="legend">범례</div>

//         </>

//     )
// }

export default Info;