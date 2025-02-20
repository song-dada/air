import './forcast.scss';

function PrevAir(props: {day: String}) {
    return <div className="forecast">
        <div className='forecastTitleArea'>{props.day}</div>
        <div className='statusDisplay'>상태</div>
    </div>
}

function Forecast() {
    return <div className="forecastArea">
        <div className="graphBar"></div>
        <div className="nowMap">
            <p>최신 대기질 분포</p>
        </div>
        <div className='prevAir'>
            <p>수도권 대기질 예보</p>
            <PrevAir day="오늘"/>            
            <PrevAir day="내일"/>            
            <PrevAir day="모레" />            
        </div>
    </div>
}

export default Forecast