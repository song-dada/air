import React, { useState, useEffect } from "react";
import "./HalfCircleProgress.scss";
import Sample from "../rest/sampleconn";

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

const HalfCircleProgress = ({ percentage }:any) => {
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
          stroke="#4caf50"
          strokeWidth="8"
          strokeLinecap="round" // <!-- 끝부분 둥글게 -->
          strokeDasharray="125.6"
          strokeDashoffset={`${125.6 - (percentage / 100) * 125.6}`}
        />
      </svg>
      <div className="progress-text">{percentage}%</div>
    </div>
  );
};

const App = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // const interval = setInterval(() => {
    //   if (progress < 100) {
    //     setProgress((prev) => prev + 10);
    //   } else {
    //     clearInterval(interval);
    //   }
    // }, 1000);
    // return () => clearInterval(interval);
    
  }, [progress]);

  return( 
    <>
      <Sample/>
      {/* <HalfCircleProgress percentage={progress} />; */}
    </>
  )
};

export default App;