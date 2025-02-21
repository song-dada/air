import React, { useState, useEffect } from "react";
import "./HalfCircleProgress.scss";
import './sass/item.scss'

const Create = ({ onKey, onValue, onShow}:any) => {
  const getData = redsaa(onKey, onValue); // 키랑 값을 넘겨서 객체타입으로 받음
  let color: string = "#000000"; // 그래프 색상
  let state: string='' // 상태
  if( getData !== null){
    if( getData.value <= 50 ){ color="#0000ff"; state="좋음"}
    else if(getData.value <= 100){ color="#00ff00"; state="보통"}
    else if(getData.value <= 150){ color="#ffff00"; state="나쁨"}
    else if(getData.value <= 200){ color="#ff0000"; state="매우나쁨"}
    return (
      <div className="half-circle-progress infoItem" onClick={()=>{onShow();}}>
        <svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
          <path
          // <!-- 배경 반원 -->
            d="M 10,50 A 40,40 0 0 1 90,50"
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="8"
            strokeLinecap="round"
            
          />
          <path
          // <!-- 프로그레스 바 -->
            d="M 10,50 A 40,40 0 0 1 90,50"
            fill="none"
            stroke={ color }
            strokeWidth="8"
            strokeLinecap="round" // <!-- 끝부분 둥글게 -->
            strokeDasharray="125.6"
            // strokeDashoffset={`${125.6 - (onValue / 200) * 125.6}`}
            strokeDashoffset={`${125.6 - (getData.value / 200) * 125.6}`}
          />
        </svg>
        <div className="progress-text">
          {state} :
          {getData.name} : 
          {getData.value}
          <figure>{getData.unit}</figure>
        </div>
      </div>
    );
  }else{
    return (
      <div className="infoItem"/>
    )
  }
};

const redsaa=( key: string, avg: number)=>{
  let areaval: any[]=[];
  const khaival: any[]=[0, 50, 51, 100, 101, 150, 151, 200];
  let iP, cP = avg, cLow, cHigh, iLow, iHigh;
  // iP 오염 물질 지수 - 이거 리턴해서 줄거임
  // cP 측정값 - 넘겨받은 값이니 지금은 avg
  // cLow 측정값이 속한 구간의 최소
  // cHigh 최대
  // iLow 구간의 해당하는 지수값의 최소
  // iHigh 최대;

  // 넘기는 값의 형태
  let returnData = { 
    name: '',
    unit: '',
    value: 0
  };

  // 값 구분
  if(key.includes('pm10')){ 
    areaval=[0, 30, 31, 80, 81, 150, 151, 200]; 
    returnData.name = "미세먼지"; 
    returnData.unit="㎍/㎥" } // clow/chigh 설정
  else if(key.includes('pm25')){ 
    areaval=[0, 15, 16, 35, 36, 75, 76, 200];
     returnData.name = "초미세먼지"; 
     returnData.unit="㎍/㎥"} 
  else if(key.includes('o3')){ 
    areaval=[0, 0.03, 0.031, 0.09, 0.091, 0.15, 0.151, 0.2]; 
    returnData.name = "오존"; 
    returnData.unit="ppm" } 
  else if(key.includes('no2')){ 
    areaval=[0, 0.03, 0.031, 0.06, 0.061, 0.2, 0.201, 0.6]; 
    returnData.name = "이산화질소"; 
    returnData.unit="ppm" } 
  else if(key.includes('so2')){ 
    areaval=[0, 0.2, 0.21, 0.5, 0.051, 0.15, 0.151, 0.6]; 
    returnData.name = "아황산가스"; 
    returnData.unit="ppm" } 
  else if(key.includes('co')){ 
    areaval=[0, 2, 2.1, 9, 9.1, 15, 15.1, 30]; 
    returnData.name = "일산화탄소"; 
    returnData.unit="ppm" } 
  else{ return null; }

  // 기준 값...
  if(areaval[0] <= avg && avg <= areaval[1]){ 
    cLow = areaval[0]; cHigh = areaval[1];
    iLow = khaival[0]; iHigh = khaival[1];
  }
  else if(areaval[2] <= avg && avg <= areaval[3]){ 
    cLow = areaval[2]; cHigh = areaval[3];
    iLow = khaival[2]; iHigh = khaival[3];
  }
  else if(areaval[4] <= avg && avg <= areaval[5]){ 
    cLow = areaval[4]; cHigh = areaval[5];
    iLow = khaival[4]; iHigh = khaival[5];
  }else if( avg >= areaval[6] ){ 
    cLow = areaval[6]; cHigh = areaval[7];
    iLow = khaival[6]; iHigh = khaival[7];
  }

  iP = ( iHigh - iLow )/( cHigh - cLow) * (cP - cLow) + iLow ; // 수치 결산
  returnData.value = iP.toFixed(2); // 소수점 2자리까지

  return returnData; // 정보 리턴
}
function App(props: any) {
    // console.log(props.onOneRow); // 값 가져오는거 왁인
    console.log(props); // 값 가져오는거 왁인
    let items: any[]=[];
    for (const key in props.onOneRow) {
      if(key.includes("Value")) { // 값인경우
        items.push( <Create onKey={key}  onValue={props.onOneRow[key]} onShow={props.onEvnet}/> );
      }
    }
  return(
    <>
      <div className="info">
        <h3>오늘의 미세먼지</h3>
          {items[0]}
          {items[1]}
        <h3>오늘의 대기질</h3>
          {items[2]}
          {items[3]}
          {items[4]}
          {items[5]}

      </div>
    </>
  )
}

export default App;