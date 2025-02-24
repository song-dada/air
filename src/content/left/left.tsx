import React, {useState, useEffect, useRef} from 'react';

import Info from './info/info';
import LegendRow from './legend/legendRow';
// import Etc from './tip/etc';

import Tips from './tip/tip';
import Forecast  from './forecast/forcast';

// dageom


function Left( props: any ) {
    return(
        <>
        <div className="leftArea">
            <div className="circlegraph">
                <Info getInfo={props.getData} getRow={props.getOneRow} />
                <LegendRow/>
                {/* <Etc/> */}
            </div>
            <div className="inc">
                <Forecast></Forecast>
                <Tips></Tips>
            </div>
        </div>
        </>
    )
}

export default Left;