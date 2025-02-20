// import React, {useState, useEffect, useRef} from 'react';
import './sass/legend.scss'

function LegendRow(){
    return(
        <>
            <div className="legend">
                <div className="oneCell">
                    <div className="stateColor blue"></div>
                    좋음
                </div>
                <div className="oneCell">
                    <div className="stateColor green"></div>
                    보통
                </div>
                <div className="oneCell">
                    <div className="stateColor orange"></div>
                    나쁨
                </div>
                <div className="oneCell">
                    <div className="stateColor red"></div>
                    매우나쁨
                </div>
            </div>

        </>

    )
}

export default LegendRow;