import React, { useState, useEffect } from "react";
import "./HalfCircleProgress.scss";
import './sass/item.scss'
// import { Value } from "sass";
import { khiVFunc  } from "../../khiVfunc";

// dageom

interface getData{
    name: string
    unit: string
    value: number
    original: number
}
const Create = ({ onKey, onValue, getRow, onPush}:any) => {
  // const getData = redsaa(onKey, onValue); // 키랑 값을 넘겨서 객체타입으로 받음
  const getData = khiVFunc(onKey, onValue); // 키랑 값을 넘겨서 객체타입으로 받음
  let color: string = "#000000"; // 그래프 색상
  let state: string='' // 상태
  if( getData !== null){
    if( getData.value <= 50 ){ color="#0000ff"; state="좋음"}
    else if(getData.value <= 100){ color="#00ff00"; state="보통"}
    else if(getData.value <= 150){ color="#ffff00"; state="나쁨"}
    else if(getData.value <= 200){ color="#ff0000"; state="매우나쁨"}

    // let reAllData={
    //   khiVal : getData.value,
    //   colorS : color,
    //   stateS : state,
    //   sidoName : getData.name,
    //   statioName : getRow.stationName,
    //   origin: getData.original,
    //   unit: getData.unit
    // }
    // onPush(reAllData);

    return (
      <div className="half-circle-progress infoItem">
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
        {getRow.sidoName},
        {getRow.stationName}
        {state} :
          {getData.name} : 
          {getData.value} :
          {getData.original} :
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

function App(props: any) {
    // console.log(props.onOneRow); // 값 가져오는거 왁인
    // console.log(props); // 값 가져오는거 왁인
    // let data:any[]=[];
    // const add=(row: any)=>{
    //   console.log("add call"); 
    //   console.log(row); 
    //   data.push( row )
    //   console.log("alldata 이걸로 차트 돌릴거임")
    //   console.log(data)
    // }
    let items: any[]=[];
    for (const key in props.onOneRow) {
      if(key.includes("Value")) { // 값인경우
        items.push( <Create onKey={key} 
          onValue={props.onOneRow[key]}
          getRow={props.onOneRow}
          // onPush={ (row: any) => add(row) }
          /> );
      }
    }
    // console.log("alldata 이걸로 차트 돌릴거임")

    // console.log(data)
  return(
    <>
      <div className="info">
        <h3>오늘의 미세먼지</h3>
        <div className="firstRow">
          {items[0]}
          {items[1]}
        </div>
        <h3>오늘의 대기질</h3>
        <div className="secondRow">
          {items[2]}
          {items[3]}
          {items[4]}
          {items[5]}

        </div>
      </div>
    </>
  )
}

export default App;