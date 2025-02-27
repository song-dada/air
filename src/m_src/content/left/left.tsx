import React, {useState, useEffect, useRef} from 'react';

import Info from './info/info';
import LegendRow from './legend/legendRow';
import Etc from './etc/etc';
import Weekgraph from './weekgraph/weekgraph';

// import Tips from './tip/tip';
// dageom


function Left( props: any ) {
    // console.log(props)
    return(
        <>
            <div className="leftArea">
                <div className="circlegraph">
                    <Info getInfo={props.getData} getRow={props.getOneRow} />
                    <LegendRow/>
                </div>
                <Etc getOneRow={props.getOneRow} getPrevWeekRow={ props.getPrevWeekRow }  getPrevMonthRow={ props.getPrevMonthRow }/>
                <div className="weekgraph">
                    <h3>주간 미세먼지 데이터</h3>
                    <Weekgraph getPrevWeekDatas={ props.getPrevWeekDatas }/>

                </div>
            </div>
        </>
    )
}

export default Left;