import React, {useState, useEffect, useRef} from 'react';
import PieChart from './piechart/piechart';
import Alert from './alert/alert';

function Right( {getOneRow}: any ) {
    return(
        <div className="rightArea">
            <Alert></Alert>
            <div className="ratiograph">
                <PieChart onOneRow={ getOneRow }/>
            </div>
            <div className="linegraph"></div>
        </div>
    )
}

export default Right;