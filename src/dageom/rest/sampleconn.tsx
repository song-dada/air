import React, { useEffect, useState } from "react";
import alasql from "alasql";


// "ID": 1907,
// "dataTime": "2025-02-18",
// "sidoName": "서울",
// "stationName": "강남구",
// "pm10Value": 31,
// "pm25Value": 13,
// "o3Value": 0.022,
// "no2Value": 0.02,
// "so2Value": 0.002,
// "coValue": 0.4,
// "khaiValue": 40,
// "id": 1314,
// "dmX": 37.5175623,
// "addr": "서울 강남구 학동로 426 강남구청 별관 1동",
// "dmY": 127.0472893


function UserList() {
//   const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [datas, setData] = useState<any[]>([]);
//   const [searchSido, setSearchSido] = useState(null);
//   const [searchStation, setSearchStation] = useState(null);
    let sidoList: any;
    let stationList: any;
    let oneRow: any;
    // let rowitem: any;
  const [rowitem, setRowitem] = useState<any>();

    // let rowitem: any[] = [];
  useEffect(() => {
    // REST API 호출
    fetch("http://localhost:4000/sample")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
    });
    
    if( datas && datas.length > 0 ){
        let qurey = 'SELECT DISTINCT sidoName FROM ?';
        sidoList = alasql(qurey,[datas]);
        qurey = 'SELECT DISTINCT stationName FROM ?';
        stationList = alasql(qurey,[datas]);
        qurey = 'SELECT * FROM ? WHERE stationName="강남구"';
        oneRow = alasql(qurey,[datas]);
        console.log(sidoList); 
        console.log(stationList); 
        // console.log(oneRow); 
        
    }
    // console.log(oneRow); 

    if (oneRow !== undefined) {
        console.log(oneRow);
        let rowd: any[]=[];
        for (const key in oneRow[0]) {
            // console.log(key + ":" +oneRow[0][key]);
            // rowitem = `<span> ${key} : ${oneRow[0][key]}</span>`
            rowd.push(<span> {key} : {oneRow[0][key]}</span>)
        }
        // console.log(rowitem )
        
        setRowitem((prev: any)=>{
            // return <span> {key} : {oneRow[0][key]}</span>
            return rowd;
        })
    }
    
    
  }, []);



  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }

// let sidoName: [];
// let stationName;
// let pm10Value;
// let pm25Value;
// let o3Value;
// let no2Value;
// let so2Value;
// let coValue;
// let khaiValue;
// let addr;


  return (
    // <div>
    //   <h1>User List</h1>
    //   <ul>
    //     {datas.map((data) => (
    //     //   <li key={user.id}>{user.name}</li>
    //         // console.log(data);
    //       <li key={data.stationName}>{data.stationName}</li>
    //     ))}
    //   </ul>
    // </div>
    <>
        <p>{ rowitem }</p>
    </>
  );
}

export default UserList;
