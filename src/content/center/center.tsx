import React, {useState, useEffect, useRef} from 'react';
import { KakaoMap } from './KakaoMap'
import { TbMapPinSearch } from "react-icons/tb";
import SelectBox from '../selectbox/seletbox';
import Clock from './clock/clock'

import './center.scss'

const Center = ( props: any) => {
    const [sido, setSido] = useState('rlqhs');
    const [station, setStation] = useState('rlqhs');
    const [address, setAddress] = useState('rlqhs');

    const alretA = (item: any)=>{
        props.onSetStation( item );
    }

    useEffect(()=>{
        // console.log(props)
        const oneRow = props.getOneRow;
        if(oneRow !== undefined){
            setSido(oneRow.sidoName);
            setStation(oneRow.stationName);
            setAddress(oneRow.addr);
        }
    },[props]);

    return(
        <>
            <div className="centerArea" >
                <div className="titleArea">
                    <div className='titleSido'>
                        <p>{sido}</p>
                        <p>{station}</p>
                    </div>
                    <p>{address}</p>
                <div className='centerSelectArea'>
                    <SelectBox
                        getSidoList={props.onSidoList}
                        getStationList={props.onStationList}
                        onSetSido={props.onSetSido}
                        onSetStation={props.onSetStation} />
                </div>
                    <button type="button" onClick={ () => props.onSetMode("show")  }><TbMapPinSearch /></button>
                </div>
                <div className="mapArea">
                    <KakaoMap onGetObj={ (item: any)=> alretA( item ) }/>
                    <Clock/>
                </div>
            </div>
        </>
    )
}

export default Center;
