import React, {useState, useEffect, useRef} from 'react';
import { KakaoMap } from './KakaoMap'
// dageom

import './center.scss';

function Center({findSido, onSetSido, onSetStation}: any) {
    const alretA = (item: any)=>{
        // if( findSido.includes( item ) ){
        //     console.log("시도인경우");
        //     onSetSido( item );
        // }else{
            console.log("측정소인경우");
            onSetStation( item );
        // }
        console.log(item);
    }

    
    
    function Clock() {
        const nowClock = () => {
            const today = new Date();
            const hour = ("00"+today.getHours().toString()).slice(-2);
            const min = ("00"+today.getMinutes().toString()).slice(-2);
            const sec = ("00"+today.getSeconds().toString()).slice(-2);

            return `${hour} : ${min} : ${sec}`
        }
        
        const nowDate = () => {
            const today = new Date();
            const year = today.getFullYear();
            const month = ("00"+(today.getMonth()+1).toString()).slice(-2);
            const day = ("00"+today.getDate().toString()).slice(-2);

            return `${year}.${month}.${day}.`
        }

        const [todayC, setTodayC] = useState(nowClock);
        const [todayD, setTodayD] = useState(nowDate);

        useEffect(()=>{
            const timer = setTimeout(() => {
                setTodayC(nowClock);
            }, 1000)

            const dateArea = setTimeout(() => {
                setTodayD(nowDate);
            }, 24 * 60 * 60 * 1000)
            
            return () => {
                clearTimeout(timer);
                clearTimeout(dateArea);
            }

        }, [todayC, todayD])

        return <div className='clockArea'>
            <p>{todayD}</p>
            <p>{todayC}</p>
        </div>
    } 
    return(
        <>
            <div className="centerArea" >
                <div className="titleArea">
                    <h1>로고</h1>
                    <p>서울시 00측정소</p>
                    <p>서울시 어쩌구 주소</p>
                    <Clock/>
                </div>
                <div className="mapArea">
                    <KakaoMap onGetObj={ (item: any)=> alretA( item ) }/>
                </div>
                {/* dkjlsjfdklj */}
            </div>
        </>
    )
}

export default Center;