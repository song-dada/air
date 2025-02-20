import React, { useState } from 'react';
import './header.scss'


// locationData 타입을 type으로 정의
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
    <div>
        <div><img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fkor.pngtree.com%2Fso%2F%25EA%25B2%2580%25EC%2583%2589-%25EC%2595%2584%25EC%259D%25B4%25EC%25BD%2598&psig=AOvVaw0TICegsQeMeEp3kQiTmoZu&ust=1739974136509000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJC4t_OyzYsDFQAAAAAdAAAAABAI" alt="" /></div>
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


function Header() {
    return(
        <header>
            {/* 로고, 메뉴, 셀렉트 박스, 되나? */}
            <a href='/' className='logo'>logo</a>
            <nav>
                <ul>
                    <li><a href="/">수도권조회</a></li>
                    <li><a href="/">통계데이터</a></li>
                </ul>
            </nav>
            <SelectBox></SelectBox>
        </header>
    )
}

export default Header