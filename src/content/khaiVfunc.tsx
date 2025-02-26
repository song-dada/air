interface getData{
    name: string
    unit: string
    enn: string
    value: number
    original: number
    maxV: number
    minV: number
    arr: number[]
}

export const khaiVFunc= ( key: string, values: number)=>{
    let areaval: number[]=[];
    const khaival: number[]=[0, 50, 51, 100, 101, 150, 151, 200];
    let iP: number = 0, 
    cP: number = values,
    cLow: number = 0,
    cHigh: number = 0,
    iLow: number = 0,
    iHigh: number = 0;
    // iP 오염 물질 지수 - 이거 리턴해서 줄거임
    // cP 측정값 - 넘겨받은 값이니 지금은 avg
    // cLow 측정값이 속한 구간의 최소
    // cHigh 최대
    // iLow 구간의 해당하는 지수값의 최소
    // iHigh 최대;
  
    // 넘기는 값의 형태
    let returnData: getData = { 
      name: '',
      unit: '',
      enn: '',
      value: 0,
      original: values,
      maxV: 0,
      minV: 0,
      arr: []
    };
  
    // 값 구분
    if(key.includes('pm10')){ 
      areaval=[0, 30, 31, 80, 81, 150, 151, 200]; 
      returnData.name = "미세먼지"; 
      returnData.unit="㎍/㎥"  // clow/chigh 설정
      returnData.enn = "pm10";
    }
    else if(key.includes('pm25')){ 
      areaval=[0, 15, 16, 35, 36, 75, 76, 150];
       returnData.name = "초미세먼지"; 
      returnData.enn = "pm25";
       returnData.unit="㎍/㎥"} 
    else if(key.includes('o3')){ 
      areaval=[0, 0.03, 0.031, 0.09, 0.091, 0.15, 0.151, 0.2]; 
      returnData.enn = "o3";
      returnData.name = "오존"; 
      returnData.unit="ppm" } 
    else if(key.includes('no2')){ 
      areaval=[0, 0.03, 0.031, 0.06, 0.061, 0.2, 0.201, 0.6]; 
      returnData.enn = "no2";
      returnData.name = "이산화질소"; 
      returnData.unit="ppm" } 
    else if(key.includes('so2')){ 
      areaval=[0, 0.2, 0.21, 0.5, 0.051, 0.15, 0.151, 0.6]; 
      returnData.enn = "so2";
      returnData.name = "아황산가스"; 
      returnData.unit="ppm" } 
    else if(key.includes('co')){ 
      areaval=[0, 2, 2.1, 9, 9.1, 15, 15.1, 30]; 
      returnData.enn = "co";
      returnData.name = "일산화탄소"; 
      returnData.unit="ppm" } 
    else{ return null; }
  
    // 기준 값... 
    if(areaval[0] <= values && values <= areaval[1]){ 
      cLow = areaval[0]; cHigh = areaval[1];
      iLow = khaival[0]; iHigh = khaival[1];
    }
    else if(areaval[2] <= values && values <= areaval[3]){ 
      cLow = areaval[2]; cHigh = areaval[3];
      iLow = khaival[2]; iHigh = khaival[3];
    }
    else if(areaval[4] <= values && values <= areaval[5]){ 
      cLow = areaval[4]; cHigh = areaval[5];
      iLow = khaival[4]; iHigh = khaival[5];
    }else if( values >= areaval[6] ){ 
      cLow = areaval[6]; cHigh = areaval[7];
      iLow = khaival[6]; iHigh = khaival[7];
    }
  
    iP = ( iHigh - iLow )/( cHigh - cLow) * (cP - cLow) + iLow ; // 수치 결산
    returnData.value = parseFloat( iP.toFixed(2) ); // 소수점 2자리까지
    returnData.minV = areaval[0];
    returnData.maxV = areaval[7];
    returnData.arr = areaval;
    return returnData; // 정보 리턴
  }