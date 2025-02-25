import React, {useState, useEffect, useRef} from 'react';

import Info from './info/info';
import LegendRow from './legend/legendRow';
import Etc from './etc/etc';

import Tips from './tip/tip';
// import Forecast  from './tip/etc';
// import Etc  from './tip/etc';
// src\content\left\legend\legendRow.tsx
// dageom


function Left( props: any ) {
    return(
        <>
        <div className="leftArea">
            <div className="circlegraph">
                <Info getInfo={props.getData} getRow={props.getOneRow} />
                {/* <LegendRow/> */}
                {/* <Etc/> */}
                <LegendRow/>
            </div>
            <div className="inc">
                <Etc getRow={props.getOneRow} getPrevRow={ props.getPrevRow }/>
                <Tips></Tips>
            </div>
        </div>
        </>
    )
}

export default Left;