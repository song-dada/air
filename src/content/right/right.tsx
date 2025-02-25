import React, {useState, useEffect, useRef} from 'react';
import PieChart from './piechart/piechart';
import Alert from './alert/alert';

import LineChart from './line/linechart';

function Right( {getOneRow}: any ) {
    return(
        <div className="rightArea">
            <Alert></Alert>
            <div className="ratiograph">
                <h3>대기질 비율</h3>
                <PieChart onOneRow={ getOneRow }/>
            </div>
            <div className="linegraph">
                <h3>예상</h3>
                <LineChart></LineChart>
            </div>
        </div>
    )
}

export default Right;