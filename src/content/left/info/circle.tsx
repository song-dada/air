// import React, { useState, useEffect } from "react";
import "./sass/HalfCircleProgress.scss";
import './sass/item.scss'
import { khaiVFunc } from "../../khaiVfunc";

// dageom

interface getData {
  name: string
  unit: string
  value: number
  original: number
}
const Create = ({ onKey, onValue }: any) => {
  const getData = khaiVFunc(onKey, onValue); // 키랑 값을 넘겨서 객체타입으로 받음
  let color: string = "#000000"; // 그래프 색상
  let state: string = '' // 상태
  if (getData !== null) {
    if (getData.value <= 50) { color = "#3F8EF5"; state = "좋음" }
    else if (getData.value <= 100) { color = "#8be001"; state = "보통" }
    else if (getData.value <= 150) { color = "#FEE596"; state = "나쁨" }
    else if (getData.value <= 200) { color = "#FF595E"; state = "매우나쁨" }

    return (
      <div className="half-circle-progress infoItem">
        <svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
          <path
            // 매우 나쁨 영역 채움
            d="M 10,50 A 40,40 0 0 1 90,50"
            fill="none"
            stroke="#FF595E"
            strokeWidth="15"
            strokeDasharray="125.6"
            strokeDashoffset={`${125.6 - (4 / 4) * 125.6}`}
          />
          <path
            // 나쁨 영역 채움
            d="M 10,50 A 40,40 0 0 1 90,50"
            fill="none"
            stroke="#FEE596"
            strokeWidth="15"
            strokeDasharray="125.6"
            strokeDashoffset={`${125.6 - (3 / 4) * 125.6}`}
          />
          <path
            //  보통 영역 채움
            d="M 10,50 A 40,40 0 0 1 90,50"
            fill="none"
            stroke="#8be001"
            strokeWidth="15"
            strokeDasharray="125.6"
            strokeDashoffset={`${125.6 - (2 / 4) * 125.6}`}
          />
          <path
            //   좋음 영역 채움
            d="M 10,50 A 40,40 0 0 1 90,50"
            fill="none"
            stroke="#3F8EF5"
            strokeWidth="15"
            strokeDasharray="125.6"
            strokeDashoffset={`${125.6 - (1 / 4) * 125.6}`}
          />

          <defs>
            <clipPath id="gaugeClip">
              <path d="M 10,50 A 40,40 0 0 1 90,50 L50,50 Z" />

            </clipPath>
          </defs>
          <polygon
            points="49,25 51,25 50,2"
            stroke="none"
            fill="#333"
            strokeWidth="2" strokeLinecap="round"
            transform={`rotate(${(getData.value / 200) * 180 - 90}, 50, 50)`}
            clip-path="url(#gaugeClip)"
          />
        </svg>
        <div className="progress-text">
          <div className="circlenN">{getData.name}</div>
          <div className="circlestate">{state}</div>
          <div className="circleoriginV">
            {getData.original}
            <figure>{getData.unit}</figure>
          </div>
          <div className="circleV">
            <div className="circleminV">{getData?.minV}</div>
            <div className="circlemaxV">{getData?.maxV}</div>
          </div>
        </div>
      </div>

    );
  } else {
    return (
      <div className="infoItem" />
    )
  }
};

const App = (props: any) => {
  let items: any[] = [];
  for (const key in props.onOneRow) {
    if (key.includes("Value")) { // 값인경우
      items.push(<Create onKey={key}
        onValue={props.onOneRow[key]}
        getRow={props.onOneRow}
      />);
    }
  }

  return (
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
