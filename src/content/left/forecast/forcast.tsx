import './forcast.scss';
// hyomin

function PrevAir(props: {day: String}) {
    return <div className="forecast">
        <h3 className='forecastTitleArea'>{props.day}</h3>
        <div className='statusDisplay'>상태</div>
    </div>
}

function Forecast() {
    return <div className="forecastArea">
        {/* <div className="graphBar"></div>
        <div className="nowMap">
            <p>최신 대기질 분포</p>
        </div> */}
        {/* <div className='prevAir'> */}
            <PrevAir day="전주대비 증감율"/>            
            <PrevAir day="전월대비 증감율"/>            
        {/* </div> */}
    </div>
}

export default Forecast