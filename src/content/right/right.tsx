import React, {useState, useEffect, useRef} from 'react';
import PieChart from './piechart/piechart';

function Right( {getOneRow}: any ) {
    return(
        <div className="rightArea"  style={{flex: 1}}>
            우측 영역입니다.
            <PieChart onOneRow={ getOneRow }/>
        </div>
    )
}

export default Right;