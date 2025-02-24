import React, {useState, useEffect, useRef} from 'react';

import Info from './info/info';
import LegendRow from './legend/legendRow';
import Etc from './etc/etc'

// dageom


function Left( props: any ) {
    // console.log( props.getPrevRow );
    return(
        <>
        <div className="leftArea"  style={{flex: 1}}>
            <Info getInfo={props.getData} getRow={props.getOneRow} />
            <LegendRow/>
            <Etc getRow={props.getOneRow} getPrevRow={ props.getPrevRow }/>
        </div>
        </>
    )
}

export default Left;