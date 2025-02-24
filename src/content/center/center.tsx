import React, {useState, useEffect, useRef} from 'react';
import { KakaoMap } from './KakaoMap'
// dageom

function Center({findSido, onSetSido, onSetStation}: any) {
    const alretA = (item: any)=>{
        // if( findSido.includes( item ) ){
        //     console.log("시도인경우");
        //     onSetSido( item );
        // }else{
            // console.log("측정소인경우");
            onSetStation( item );
        // }
        // console.log(item);
    }
    return(
        <>
            <div className="centerArea"  style={{flex: 1}} >
                <KakaoMap onGetObj={ (item: any)=> alretA( item ) }/>
                {/* dkjlsjfdklj */}
            </div>
        </>
    )
}

export default Center;