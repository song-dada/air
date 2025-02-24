import React, {useState, useEffect, useRef} from 'react';
// import PieChart from './piechart/piechart';

import Alert from './alert/alert';

function Right( {getOneRow}: any ) {
    return(
        <div className="rightArea">
            {/* <PieChart onOneRow={ getOneRow }/> */}
            <Alert></Alert>
            <div className="ratiograph"></div>
            <div className="linegraph"></div>
        </div>
    )
}

export default Right;