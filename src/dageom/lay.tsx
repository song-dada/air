import React, {useState, useEffect, useRef} from 'react'
import './sass/lay.scss'
import RestA from './rest/test'


type ClickProps = {
    chaState: (id: string) => void; // 문자열을 인수로 받는 함수 타입
    getRef: () => void;
  };

function DetailInfo( {onShow, onClose}:any ) {
    const showObj = useRef<HTMLDivElement | null>(null);
    useEffect(()=>{
        let showDiv = showObj.current;
        if(showDiv){
            showDiv.style.top = onShow;
        }
    },[onShow]);
    return(
        <div className={`detailInfo`} ref={showObj}>
            일단 이게 위로 올라오고 내려오는???
            <button type="button" className="closeBtn" onClick={()=> onClose() }>close</button>
            <LegendRow/>
        </div>
    )
}
function Info( {onMode}:any ) {
    const [show, setShow] = useState<string>('100%');
    const upNdown=()=>{
        let up = '0';
        let down = '100%'
        setShow( (prev) => {
            if(prev === up){
                return down;
            }else{
                return up;
            }
        });
    };
    const close=()=>{
        setShow( (prev) => {
            return '100%';
        });
    }
    if(!onMode){
        return null;
    }
    else{
        return(
            <>
                <div className={`infoA ${onMode}`}>
                    <div className="address">
                        <h2>지역 지역</h2>
                        <h3>날짜 날짜</h3>
                        <p>세부지역 위치는 어디라고 해야하지</p>
                    </div>
                    <div className={`info`}>
                    <h3>오늘의 미세먼지</h3>
                        <div className="infoItem" onClick={ ()=> { upNdown(); } }> 데이터 1 </div>
                        <div className="infoItem" onClick={ ()=> { upNdown(); } }> 데이터 2 </div>
                    <h3>오늘의 대기질</h3>
                        <div className="infoItem" onClick={ ()=> { upNdown(); } }> 데이터 3 </div>
                        <div className="infoItem" onClick={ ()=> { upNdown(); } }> 데이터 4 </div>
                        <div className="infoItem" onClick={ ()=> { upNdown(); } }> 데이터 5 </div>
                        <div className="infoItem" onClick={ ()=> { upNdown(); } }> 데이터 6 </div>
                    </div>
                    {/* <div className="legend">범례</div> */}
                    <LegendRow/>
                    <DetailInfo onShow={show} onClose={ close }/>
                </div>
            
            </>
        )
    }
}
function LegendRow(){
    return(
        <>
            <div className="legend">범례</div>

        </>

    )
}
function View( {onMode}:any ) {
    if(!onMode){
        return null;
    }
    else{
        return(
            <>
                <div className={`view ${onMode}`}>

                    <div className="alertArea">
                        <div className="alert">미세먼지 경보</div>
                        <div className="alert">초미세먼지 경보</div>
                        <div className="alert doit">행동 요령</div>
                        
                    </div>
                    <div className="radarArea">
                        <div className="graphBar">범례</div>
                        <div className="nowMap">현재 대기질</div>
                        <div className="prevMap">예상 대기질</div>
                    </div>
                </div>
            
            </>
        )
    }
}
function Click( {chaState, getRef}: ClickProps ) {
    return(
        <>
            <div className="click" id="click" ref={getRef}
            onClick={ (e)=>{ chaState( e.currentTarget.id ) } }>
                클릭 지도
            </div>
        </>
    )
    
}
function Header() {
    return(
        <header>
            로고, 메뉴, 셀렉트 박스
        </header>
    )
}
function Footer() {
    return(
        <footer>
            (C) 2025-03 CleanSky
        </footer>
    )
}
function Main() {
    const [mode, setMode] = useState(true);
    const block1:any = useRef(null);
    const block2:any = useRef(null);
    const block3:any = useRef(null);
    const folder = ( id: String ) => {
        console.log(1234);
        setMode((prev) => !prev)
    }
    
    return(
        <>
            <div id="layout" className="layout">
                <Header/>
                <body>
                    <div className="center">
                        <Click getRef={ block1 } chaState={( id: String )=>{ folder(id) }}/>
                        <View getRef={ block2 } onMode={ mode }/>
                        <Info  getRef={ block3 } onMode={ !mode }/>

                    </div>

                    
                </body>
                {/* <RestA/> */}
                <Footer/>
            </div>


        </>
    )
}
export default Main