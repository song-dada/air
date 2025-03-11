// import './alert.scss'
import { AiFillAlert } from "react-icons/ai";
import alasql from "alasql";
import { useEffect, useState } from 'react';
import { useStation } from "../../../context/StationContext";
// hyomin
// dageom
// jaekyeong


const Alert = (props: any) => {
    //
    const [showPopup, setShowPopup] = useState(false);
    const { setSelectedStation, selectedStation } = useStation() || {}; 
    //

    let title: string =''
    let printText: string='';
    let fillColor='#ddd';
    
    // 경보와 주의보 모두 저장
    let redStations: any[] = props.onRed || [];
    let yellowStations: any[] = props.onYellow || [];
    let hasStations = redStations.length > 0 || yellowStations.length > 0;
    let totalStations = redStations.length + yellowStations.length;
    //

    useEffect(() => {
        if (!selectedStation) return;
        if (selectedStation) {
            console.log("Selected station: ", selectedStation.stationName);
        }
    }, [selectedStation]);  // selectedStation이 변경될 때마다 실행

    // 우선순위 경보 > 주의보 순 (표시용)
    if(redStations.length > 0){
        fillColor='#FF595E';
        title='경보';
        printText = redStations[0]["stationName"];
        if(totalStations > 1) {
            printText += " 외" + (totalStations - 1) + "곳";
        }
    } else if(yellowStations.length > 0){
        fillColor='#FEE596';
        title='주의보';
        printText = yellowStations[0]["stationName"];
        if(totalStations > 1) {
            printText += " 외" + (totalStations - 1) + "곳";
        }
    }

    const togglePopup = () => {
        if(totalStations > 1) {
            setShowPopup(!showPopup);
        }
    }

    const handleStationClick = (station: any) => {
        setSelectedStation(station);
        setShowPopup(!showPopup);
    }
    
    const renderStationText = () => {
        if (printText === '') return '발령 없음';
        if (totalStations <= 1) return printText;
        // 경보가 있으면 경보의 첫 측정소를, 없으면 주의보의 첫 측정소를 표시
        const mainStation = redStations.length > 0 ? 
            redStations[0]["stationName"] : yellowStations[0]["stationName"];
        const countText = "외" + (totalStations - 1) + "곳";

        return (
            <div>
                {mainStation}
                <span className='station-count' onClick={togglePopup} style={{ cursor: 'pointer', textDecoration: 'underline'}}>
                {countText}
                </span>
            </div>
        )
    }
    
    return ( 
        <div className="alert">
            <div className="alertIcon">
                <AiFillAlert fill={ fillColor }/>
            </div>
            <p>{props.title} {title}</p>
            <p>{renderStationText()}</p>
            
            {showPopup && (
                <div className="stationPopup">
                    <div className='stationPopupContent'>
                        <div className='popupHeader'>
                            <h3>{props.title} 측정소 목록</h3>
                            <button onClick={() => setShowPopup(false)}>x</button>
                        </div>
                        
                        {/* 경보 측정소가 있으면 표시 */}
                        {redStations.length > 0 && (
                            <div className="alertSection">
                                <h4 className="redAlert">경보</h4>
                                <ul className="stationList">
                                    {redStations.map((station, index) => (
                                        <li key={`red-${index}`}
                                            onClick={() => handleStationClick(station)}
                                            style={{ cursor: "pointer"}}>
                                            {station.stationName}
                                            {props.title === "미세먼지" && station.pm10Value !== undefined && 
                                                ` - ${station.pm10Value}μg/m³`}
                                            {props.title === "초미세먼지" && station.pm25Value !== undefined && 
                                                ` - ${station.pm25Value}μg/m³`}
                                            {props.title === "오존" && station.o3Value !== undefined && 
                                                ` - ${station.o3Value}ppm`}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {/* 주의보 측정소가 있으면 표시 */}
                        {yellowStations.length > 0 && (
                            <div className="alertSection">
                                <h4 className="yellowAlert">주의보</h4>
                                <ul className="stationList">
                                    {yellowStations.map((station, index) => (
                                        <li key={`yellow-${index}`}
                                            onClick={() => handleStationClick(station)}
                                            style= {{ cursor: "pointer"}}>
                                            {station.stationName}
                                            {props.title === "미세먼지" && station.pm10Value !== undefined && 
                                                ` - ${station.pm10Value}μg/m³`}
                                            {props.title === "초미세먼지" && station.pm25Value !== undefined && 
                                                ` - ${station.pm25Value}μg/m³`}
                                            {props.title === "오존" && station.o3Value !== undefined && 
                                                ` - ${station.o3Value}ppm`}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

const AlertArea = ( {onAdata}: any ) => {
    const [pm10, setpm10] = useState<any>([]);
    const [pm10E, setpm10E] = useState<any>([]);
    const [pm25, setpm25] = useState<any>([]);
    const [pm25E, setpm25E] = useState<any>([]);
    const [o3, seto3] = useState<any>([]);
    const [o3E, seto3E] = useState<any>([]);

    const [selectedStation, setSelectedStation] = useState<any>(null);

    useEffect(() => {
        console.log("선택된 스테이션:", selectedStation);
        if (selectedStation) {
            // dd..
        }
    }, [selectedStation]);

 useEffect(() => {
        // 데이터 로깅 (디버깅용)
        console.log('Original data:', onAdata);
        
        try {
            // 미세먼지 주의보
            let query = 'SELECT stationName, pm10Value FROM ? WHERE pm10Value >= 81 AND pm10Value <= 150';
            let resultList = alasql(query, [onAdata]);
            console.log('PM10 Yellow:', resultList);
            setpm10(resultList);
            
            // 미세먼지 경보
            query = 'SELECT stationName, pm10Value FROM ? WHERE pm10Value >= 151';
            let resultListE = alasql(query, [onAdata]);
            console.log('PM10 Red:', resultListE);
            setpm10E(resultListE);
            
            // 초미세먼지 주의보
            query = 'SELECT stationName, pm25Value FROM ? WHERE pm25Value >= 36 AND pm25Value <= 75';
            resultList = alasql(query, [onAdata]);
            console.log('PM2.5 Yellow:', resultList);
            setpm25(resultList);
            
            // 초미세먼지 경보
            query = 'SELECT stationName, pm25Value FROM ? WHERE pm25Value >= 76';
            resultListE = alasql(query, [onAdata]);
            console.log('PM2.5 Red:', resultListE);
            setpm25E(resultListE);
            
            // 오존 주의보
            query = 'SELECT stationName, o3Value FROM ? WHERE o3Value >= 0.091 AND o3Value <= 0.15';
            resultList = alasql(query, [onAdata]);
            console.log('O3 Yellow:', resultList);
            seto3(resultList);
            
            // 오존 경보
            query = 'SELECT stationName, o3Value FROM ? WHERE o3Value >= 0.151';
            resultListE = alasql(query, [onAdata]);
            console.log('O3 Red:', resultListE);
            seto3E(resultListE);
        } catch (error) {
            console.error('Error in alasql queries:', error);
        }
    }, [onAdata]);
    
    return (
        <div className="upArea">
            <div className="alertArea">
                <Alert title={"미세먼지"} onYellow={pm10} onRed={pm10E} onStationSelect={setSelectedStation}/>
                <Alert title={"초미세먼지"} onYellow={pm25} onRed={pm25E} onStationSelect={setSelectedStation}/> 
                <Alert title={"오존"} onYellow={o3} onRed={o3E} onStationSelect={setSelectedStation}/> 
            </div>
        </div>
    );
}

export default AlertArea
