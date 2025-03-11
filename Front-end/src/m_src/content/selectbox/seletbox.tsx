import React, {useState, useEffect, useRef} from 'react';

const SelectBox = (props: any) => {
    const [si, setsi] = useState(props.getSidoList[0]?.value);
    const [sta, setsta] = useState(props.getStationList[0]?.value);

    console.log("props.getStationList")
    console.log(props.getStationList)

    useEffect(() => {
        props.onSetSido(si);
        props.onSetStation(sta);
    }, [si, sta])

    const chanval = (e: any) => {
        if (e.currentTarget.id == "sido") {
            setsi(e.currentTarget.value);
        } else if (e.currentTarget.id == "station") {
            setsta(e.currentTarget.value);
        }
    }
    return (
        <>
            <select className="centerSelect" name="sido" id="sido" onChange={(e) => { chanval(e) }}>
                {props.getSidoList.map((item: any) => (
                    <option key={item.key || `fallback-${item.key}`} value={item.value}>
                        {item.value}
                    </option>
                ))}
            </select>
            <select className="centerSelect" name="station" id="station" onChange={(e) => props.onSetStation(e.currentTarget.value)}>
                {props.getStationList.map((item: any, index: number) => {
                    if (!item.key) {
                        console.warn("key undefined :", item);
                    }
                    return (
                        <option key={item.key || `fallback-${index}`} value={item.value}>
                            {item.value}
                        </option>
                    );
                })}
            </select>
        </>
    )
}

export default SelectBox;