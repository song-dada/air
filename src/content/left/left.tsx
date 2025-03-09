import Info from './info/info';
import LegendRow from './legend/legendRow';
import ChangeRate from './etc/ChangeRate';
import Weekgraph from './weekgraph/weekgraph';

import './left.scss';

// dageom
const Left = ( props: any ) => {return(
        <>
            <div className="leftArea">
                <div className="circlegraph">
                    <Info getInfo={props.getData} getRow={props.getOneRow} />
                    <LegendRow/>
                </div>
                <ChangeRate onStation={props.onStation }
                    getOneRow={props.getOneRow} 
                    getYesterDayRow={props.getYesterDay}
                    getPrevWeekRow={ props.getPrevWeekRow }  
                    getPrevMonthRow={ props.getPrevMonthRow }/>
                <div className="weekgraph">
                    <h3>주간 미세먼지 데이터</h3>
                    <Weekgraph getPrevWeekDatas={ props.getPrevWeekDatas }/>
                </div>
            </div>
        </>
    )
}

export default Left;