import React, { useState, useEffect } from "react";
import "./HalfCircleProgress.scss";
// import Sample from "../rest/sampleconn";

// const HalfCircleProgress = ({ percentage }:any) => {
//   return (
//     <div className="half-circle-progress">
//       <svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
//         <path
//           d="M 10,50 A 40,40 0 0 1 90,50"
//           fill="none"
//           stroke="#e0e0e0"
//           strokeWidth="8"
//         />
//         <path
//           d="M 10,50 A 40,40 0 0 1 90,50"
//           fill="none"
//           stroke="#4caf50"
//           strokeWidth="8"
//           strokeDasharray="125.6" 
//           strokeDashoffset={`${125.6 - (percentage / 100) * 125.6}`}
//         />
//       </svg>
//       <div className="progress-text">{percentage}%</div>
//     </div>
//   );
// };

// const App = () => {
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (progress < 100) {
//         setProgress((prev) => prev + 10);
//       } else {
//         clearInterval(interval);
//       }
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [progress]);

//   return <HalfCircleProgress percentage={progress} />;
// };

// export default App;

// const HalfCircleProgress = ({ percentage }:any) => {
//   return (
//     <div className="half-circle-progress">
//       <svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
//         <path
//         // <!-- 배경 반원 -->
//           d="M 10,50 A 40,40 0 0 1 90,50"
//           fill="none"
//           stroke="#e0e0e0"
//           strokeWidth="8"
//           strokeLinecap="round"
          
//         />
//         <path
//         // <!-- 프로그레스 바 -->
//           d="M 10,50 A 40,40 0 0 1 90,50"
//           fill="none"
//           stroke="#4caf50"
//           strokeWidth="8"
//           strokeLinecap="round" // <!-- 끝부분 둥글게 -->
//           strokeDasharray="125.6"
//           strokeDashoffset={`${125.6 - (percentage / 100) * 125.6}`}
//         />
//       </svg>
//       <div className="progress-text">{percentage}%</div>
//     </div>
//   );
// };
const Create=( {key, value}: any )=>{
  
}
const HalfCircleProgress = ({ onKey, onValue }:any) => {
  let color: string = "#000000";
  if( onValue <= 50 ){ color="#0000ff"; }
  else if(onValue <= 100){ color="#00ff00"; }
  else if(onValue <= 150){ color="#ffff00"; }
  else if(onValue <= 200){ color="#ff0000"; }
  return (
    <div className="half-circle-progress">
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
          strokeDashoffset={`${125.6 - (onValue / 200) * 125.6}`}
        />
      </svg>
      <div className="progress-text">{onKey} : {onValue}%</div>
    </div>
  );
};
const redsaa=( key: string, avg: number)=>{
  let areaval: any[]=[];
  const khaival: any[]=[0, 50, 51,100, 101, 150, 151];
  let iP, cP = avg, cLow, cHigh, iLow, iHigh;
  // iP 오염 물질 지수 - 이거 리턴해서 줄거임
  // cP 측정값 - 넘겨받은 값이니 지금은 avg
  // cLow 측정값이 속한 구간의 최소
  // cHigh 최대
  // iLow 구간의 해당하는 지수값의 최소
  // iHigh 최대;

  if(key =='pm10Value'){ areaval=[0, 30, 31, 80, 81, 150, 151] } // clow/chigh 설정

  if(areaval[0] <= avg <= areaval[1]){ 
    cLow = areaval[0]; cHigh = areaval[1];
    iLow = khaival[0]; iHigh = khaival[1];
  }
  else if(areaval[2] <= avg <= areaval[3]){ 
    cLow = areaval[2]; cHigh = areaval[3];
    iLow = khaival[2]; iHigh = khaival[3];
  }
  else if(areaval[4] <= avg <= areaval[5]){ 
    cLow = areaval[4]; cHigh = areaval[5];
    iLow = khaival[4]; iHigh = khaival[5];
  }else if( avg >= areaval[6] ){ 
    cLow = areaval[6]; cHigh = areaval[5];
    iLow = khaival[6]; iHigh = khaival[5];
  }



  return
}
function App(props: any) {
    console.log(props.onOneRow);
    let items: any[]=[];
    for (const key in props.onOneRow) {
      console.log( key+":"+props.onOneRow[key]);
      items.push( <HalfCircleProgress onKey={key}  onValue={100}/> )
    }
  return(
    <>
      {/* <HalfCircleProgress percentage={progress} />; */}
      123
      {items.map((item)=>(
        item
      ))}
    </>
  )
}

export default App;