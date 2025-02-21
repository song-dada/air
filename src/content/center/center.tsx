import React, {useState, useEffect, useRef} from 'react';
import { KakaoMap } from './KakaoMap'
// dageom

function Center() {
    return(
        <>
            <div className="centerArea"  style={{flex: 1}}>
                <KakaoMap />
                {/* dkjlsjfdklj */}
            </div>
        </>
    )
}

export default Center;