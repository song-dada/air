import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

// 측정소 데이터 타입 정의
interface StationData {
  ID: number;
  dataTime: string;
  sidoName: string;
  stationName: string;
  pm10Value: number;
  pm25Value: number;
  o3Value: number;
  no2Value: number;
  so2Value: number;
  coValue: number;
  khaiValue: number;
  id: number;
  dmX: number;  // 위도
  dmY: number;  // 경도
  addr: string;
}

export const KakaoMap = () => {
  const [stations, setStations] = useState<StationData[]>([]);
  
  useEffect(() => {
    // 데이터 가져오기
    fetch("/today")
      .then((response) => {
        if(!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: StationData[]) => {
        console.log(data);
        setStations(data);
        initMap(data);
      })
      .catch(error => {
        console.error("데이터 가져오기 실패:", error);
      });
  }, []);
  const initMap = (stationData: StationData[]) => {
  if (!stationData || stationData.length === 0) return;
  
  const container = document.getElementById('map');
  if (!container) return;
  
  // 시도별로 데이터 그룹화
  const cityGroups: Record<string, StationData[]> = {};
  stationData.forEach(station => {
    if (!cityGroups[station.sidoName]) {
      cityGroups[station.sidoName] = [];
    }
    cityGroups[station.sidoName].push(station);
  });
  
  // 각 시도의 대표 측정소 (첫 번째 것으로 설정)
  const representativeStations = Object.keys(cityGroups).map(city => cityGroups[city][0]);
  
  const options = {
    center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울 중심
    level: 11, // 전국 단위로 시작
    zoomControl: true,
    zoomControlPosition: window.kakao.maps.ControlPosition.RIGHT
  };
  
  const map = new window.kakao.maps.Map(container, options);
  
  // 모든 마커 저장 배열
  const allMarkers: any[] = [];
  const cityMarkers: any[] = [];
  
  // 시도별 대표 마커 생성
  representativeStations.forEach(station => {
    const marker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(station.dmX, station.dmY),
      map: map,
      title: station.sidoName
    });
    
    // 시도 이름과 평균 정보를 표시하는 인포윈도우
    const cityStations = cityGroups[station.sidoName];
    const avgPm10 = Math.round(cityStations.reduce((sum, s) => sum + s.pm10Value, 0) / cityStations.length);
    const avgPm25 = Math.round(cityStations.reduce((sum, s) => sum + s.pm25Value, 0) / cityStations.length);
    
    const content = `
      <div style="padding:5px;width:150px;font-size:12px;text-align:center;">
        <strong>${station.sidoName}</strong><br>
        평균 미세먼지: ${avgPm10}㎍/㎥<br>
        평균 초미세먼지: ${avgPm25}㎍/㎥
      </div>
    `;
    
    const infowindow = new window.kakao.maps.InfoWindow({
      content: content
    });
    
    // 마커 클릭 이벤트 - 해당 시도로 확대
    window.kakao.maps.event.addListener(marker, 'click', function() {
      map.setLevel(9);
      map.setCenter(marker.getPosition());
    });
    
    // 마우스오버 이벤트
    window.kakao.maps.event.addListener(marker, 'mouseover', function() {
      infowindow.open(map, marker);
    });
    
    // 마우스아웃 이벤트
    window.kakao.maps.event.addListener(marker, 'mouseout', function() {
      infowindow.close();
    });
    
    cityMarkers.push(marker);
  });
  
  // 모든 측정소 마커 생성 (처음에는 숨김)
  stationData.forEach(station => {
    const marker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(station.dmX, station.dmY),
      map: null, // 처음에는 지도에 표시하지 않음
    });
    
    const content = `
      <div style="padding:5px;width:180px;font-size:12px;">
        <strong>${station.stationName} (${station.sidoName})</strong><br>
        미세먼지(PM10): ${station.pm10Value}㎍/㎥<br>
        초미세먼지(PM2.5): ${station.pm25Value}㎍/㎥<br>
        오존: ${station.o3Value}ppm<br>
        이산화질소: ${station.no2Value}ppm
      </div>
    `;
    
    const infowindow = new window.kakao.maps.InfoWindow({
      content: content
    });
    
    window.kakao.maps.event.addListener(marker, 'mouseover', function() {
      infowindow.open(map, marker);
    });
    
    window.kakao.maps.event.addListener(marker, 'mouseout', function() {
      infowindow.close();
    });
    
    allMarkers.push({
      marker: marker,
      info: station
    });
  });
  
  // 줌 레벨 변경 이벤트 - 레벨에 따라 마커 표시 전환
  window.kakao.maps.event.addListener(map, 'zoom_changed', function() {
    const currentLevel = map.getLevel();
    
    if (currentLevel > 9) {
      // 전국 수준 (레벨 10 이상) - 시도별 대표 마커만 표시
      cityMarkers.forEach(marker => marker.setMap(map));
      allMarkers.forEach(item => item.marker.setMap(null));
    } else if (currentLevel > 6) {
      // 중간 수준 (레벨 7-9) - 시도별 모든 측정소 표시
      cityMarkers.forEach(marker => marker.setMap(null));
      
      // 현재 지도 영역에 있는 마커만 표시
      const bounds = map.getBounds();
      allMarkers.forEach(item => {
        const position = item.marker.getPosition();
        if (bounds.contain(position)) {
          item.marker.setMap(map);
        } else {
          item.marker.setMap(null);
        }
      });
    } else {
      // 상세 수준 (레벨 6 이하) - 모든 측정소 표시
      cityMarkers.forEach(marker => marker.setMap(null));
      allMarkers.forEach(item => item.marker.setMap(map));
    }
  });
  
  // 지도 이동 완료 이벤트 - 표시 영역 내 마커만 표시
  window.kakao.maps.event.addListener(map, 'dragend', function() {
    const currentLevel = map.getLevel();
    if (currentLevel <= 9) {
      const bounds = map.getBounds();
      allMarkers.forEach(item => {
        const position = item.marker.getPosition();
        if (bounds.contain(position)) {
          item.marker.setMap(map);
        } else {
          item.marker.setMap(null);
        }
      });
    }
  });
  
  // 초기 마커 표시 설정 - 처음에는 시도별 대표 마커만 표시
  cityMarkers.forEach(marker => marker.setMap(map));
  
  // 범례 추가
  addLegend(map);
};

// 범례 추가 함수
const addLegend = (map: any) => {
  const legendContent = document.createElement('div');
  legendContent.className = 'legend';
  legendContent.innerHTML = `
    <div style="position:absolute;bottom:30px;left:10px;z-index:1000;background:white;padding:10px;border-radius:5px;box-shadow:0 0 5px rgba(0,0,0,0.2);width:300px;">
      <h4 style="margin:0 0 8px 0;font-size:14px;">대기질 정보</h4>
      <div><span style="display:inline-block;width:10px;height:10px;background:red;"></span> 시도 대표 측정소</div>
      <div><span style="display:inline-block;width:10px;height:10px;background:blue;"></span> 개별 측정소</div>
      <div style="font-size:11px;margin-top:5px;">
        확대 레벨에 따라 표시되는 정보가 달라집니다
      </div>
    </div>
  `;
  map.getNode().appendChild(legendContent);
  };
  
  return (
    <div>
      <h2>대기 오염 측정소 현황</h2>
      <div id="map" style={{ width: "740px", height: "700px"}}></div>
    </div>
  );
};
