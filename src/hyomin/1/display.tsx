import React from 'react';
import Header from '../header/header';
import Footer from '../footer/footer';
import './display.scss'
import { useState } from 'react';

type LocationData = {
    [region: string]: {
      [district: string]: string[];
    };
  };
  

  const locationData: LocationData = {
    서울: {
      강서구: ['공항동', '마곡동', '염창동'],
      강남구: ['삼성동', '역삼동', '청담동'],
      강북구: ['삼성동', '역삼동', '청담동'],
    },
    인천: {
      강화군: ['1', '2'],
      계양구: ['1', '2'],
    },
    경기: {
      고양시: ['1', '2', '3'],
      과천시: ['1', '2', '3'],
      광명시: ['1', '2', '3'],
      광주시: ['1', '2', '3'],
    }
  };
  
  
  
  const SelectBox = () => {
    const [region, setRegion] = useState(''); // 타입을 string으로 설정
    const [district, setDistrict] = useState(''); // 타입을 string으로 설정
    const [subDistrict, setSubDistrict] = useState(''); // 타입을 string으로 설정
  
    // 지역 변경 시 구 초기화
    const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setRegion(event.target.value);
      setDistrict('');
      setSubDistrict('');
    };
  
    // 구 변경 시 하위 구 초기화
    const handleDistrictChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setDistrict(event.target.value);
      setSubDistrict('');
    };
  
    // 지역 선택에 따라 구 데이터 가져오기
    const districts = region ? Object.keys(locationData[region]) : [];
  
    // 구 선택에 따라 하위 구 데이터 가져오기
    const subDistricts = district ? locationData[region][district] : [];
  
    // 링크가 활성화되면 이동할 URL 생성
    const generateLink = (): string => {
      if (region && district && subDistrict) {
        return `/location/${region}/${district}/${subDistrict}`;
      }
      return '#'; // 값이 없으면 링크 비활성화
    };
  
    // 이동 버튼 활성화 여부 확인
    const isButtonEnabled = region && district && subDistrict;
  
    return (
      <div className='l2out'>
          <div className='l2in'>
            <img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fkor.pngtree.com%2Fso%2F%25EA%25B2%2580%25EC%2583%2589-%25EC%2595%2584%25EC%259D%25B4%25EC%25BD%2598&psig=AOvVaw0TICegsQeMeEp3kQiTmoZu&ust=1739974136509000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJC4t_OyzYsDFQAAAAAdAAAAABAI" alt="" /></div>
                {/* 첫 번째 셀렉트 박스: 지역 */}
                
                <select value={region} onChange={handleRegionChange}>
                <option value="">지역 선택</option>
                {Object.keys(locationData).map((regionName) => (
                    <option key={regionName} value={regionName}>
                    {regionName}
                </option>
            ))}
            </select>
  
                {/* 두 번째 셀렉트 박스: 구 (지역 선택 시 활성화됨) */}
                <select value={district} onChange={handleDistrictChange} disabled={!region}>
                <option value="">구 선택</option>
                {districts.map((districtName) => (
                    <option key={districtName} value={districtName}>
                    {districtName}
                    </option>
                ))}
                </select>
  
                {/* 세 번째 셀렉트 박스: 하위 구 (구 선택 시 활성화됨) */}
                <select value={subDistrict} onChange={(e) => setSubDistrict(e.target.value)} disabled={!district}>
                <option value="">하위 구 선택</option>
                {subDistricts.map((sub) => (
                    <option key={sub} value={sub}>
                    {sub}
                    </option>
                ))}
                </select>
  
                {/* 버튼: 선택한 지역으로 이동 */}
        <div>
          <button
            onClick={() => {
              window.location.href = generateLink();
            }}
            disabled={!isButtonEnabled} // 모든 선택이 완료되면 활성화
          >
            학인
          </button>
        </div>
      </div>
    );
  };



  const PeriodSelect: React.FC = () => {
    // 시작일과 종료일 상태 설정 (string 타입으로 초기화)
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
  
    // 시작일과 종료일을 변경하는 함수
    const handleStartDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setStartDate(e.target.value);
    };
  
    const handleEndDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setEndDate(e.target.value);
    };
  
    return (
      <div className='l2out'>
        <div className='l2in'>
          <select id="startDate" value={startDate} onChange={handleStartDateChange}>
            <option value="">시작일 선택</option>
            <option value="2023-01-01">2023-01-01</option>
            <option value="2023-02-01">2023-02-01</option>
            <option value="2023-03-01">2023-03-01</option>
            <option value="2023-04-01">2023-04-01</option>
          </select>
        </div>
  
        <div>
          <select id="endDate" value={endDate} onChange={handleEndDateChange}>
            <option value="">종료일 선택</option>
            <option value="2023-01-31">2023-01-31</option>
            <option value="2023-02-28">2023-02-28</option>
            <option value="2023-03-31">2023-03-31</option>
            <option value="2023-04-30">2023-04-30</option>
          </select>
        </div>
  
        <div>
          {startDate && endDate && (
            <p>
              선택한 기간: {startDate} ~ {endDate}
            </p>
          )}
        </div>
      </div>
    );
  };
  


  // 테이블 데이터의 타입 정의 (각 셀은 문자열)
  type TableData = string[][];
  
  const Table: React.FC = () => {
    // 8x4 표의 행과 열 크기 설정
    const rows = 8;
    const columns = 4;
  
    // 표 데이터 생성
    const tableData: TableData = [
      ['','Column 1', 'Column 2', 'Column 3'], // 첫 번째 행: 제목
      ['Name 1', 'Data 1-1', 'Data 1-2', 'Data 1-3'],
      ['Name 2', 'Data 2-1', 'Data 2-2', 'Data 2-3'],
      ['Name 3', 'Data 3-1', 'Data 3-2', 'Data 3-3'],
      ['Name 4', 'Data 4-1', 'Data 4-2', 'Data 4-3'],
      ['Name 5', 'Data 5-1', 'Data 5-2', 'Data 5-3'],
      ['Name 6', 'Data 6-1', 'Data 6-2', 'Data 6-3'],
      ['Name 7', 'Data 7-1', 'Data 7-2', 'Data 7-3'],
      ['Name 8', 'Data 8-1', 'Data 8-2', 'Data 8-3']
    ];
  
    return (
      <div>
        <table style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {/* 첫 번째 행: 제목, 첫 번째 칸은 비어있음 */}
              {tableData[0].map((cellData, colIndex) => (
                <th key={colIndex} style={{ padding: '8px', textAlign: 'center' }}>
                  {cellData}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 두 번째 행부터 8번째 행까지 데이터 */}
            {tableData.slice(1).map((rowData, rowIndex) => (
              <tr key={rowIndex + 1}>
                {/* 첫 번째 열은 'Name X' */}
                {rowData.map((cellData, colIndex) => (
                  <td key={colIndex} style={{ padding: '8px', textAlign: 'center' }}>
                    {cellData}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  

function In() {
    return <div className='l1'>
        <h2>수도권 대기 정보 통계</h2>
        <div className='l2'>
            <div className='l2in'>
                <p>지역 검색</p>
                <SelectBox/>
            </div>
            <div className='l2in'>
                <p>조회 기간</p>
                <PeriodSelect></PeriodSelect>
            </div>
        </div>
        <div className='l3'>
            <div className='l3d'>
                <h3>전월대비 표 데이터</h3>
                <Table/>
            </div>
            <div className='l3content'>
                <h3>그래프</h3>
                <div className='btn'>
                    <button>1</button>
                    <button>2</button>
                    <button>3</button>
                    <button>4</button>
                    <button>5</button>
                    <button>6</button>
                    <button>7</button>
                </div>
                <div className='graph'>그래프</div>
            </div>
        </div>
    </div>
}

function Dp() {
    return <div className='ll'>
        <Header></Header>
        <div className='b'>
            <In></In>
        </div>
        <Footer></Footer>
    </div>
}

export default Dp