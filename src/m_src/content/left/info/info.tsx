import React, {useState, useEffect, useRef} from 'react';
import CircleP from './circle';
function InfoItem({passValue}:any):any {
    return(
        <>
            <div className="infoItem">
                <CircleP onOneRow={ passValue }/>
            </div>
        </>
    )
}

function Info( props: any ) {
        return(
            <>
                <div className={`infoA`}>
                    <InfoItem passValue={props.getRow}></InfoItem>
                </div>
            
            </>
        )
    
}
export default Info;