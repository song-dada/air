// import React, { useState } from "react"
import './alert.scss'
import { AiTwotoneAlert } from "react-icons/ai";

// hyomin

function Alert(props: {title: String}) {
    // const [alert, setAlert] = 0;

    return <div className="alert">
        <div className="alertIcon"><AiTwotoneAlert /></div>
        <p>{props.title} 주의보/경보</p>
        <p>발령없음</p>
    </div>
}

function Tips() {
    // const [value, setValue] = useState<number>(0);
    const comment = {
        usual: [
            "외출시 보건용 마스크를 착용하세요",
            "외출시",
            "외출시 보건용",
            "외출시 보건용 마스크를",
        ],
        warning: [
            "위험함",
            "위험함12",
            "위험함12345",
        ]

    }

    // if() {

    // }

    return <div className="tipBox">
        <div className="tipMessage">{comment.usual}</div>
        <div className="imgbox">
            <div className="imgicon"></div>
        </div>
    </div>
}

function AlertArea() {
    return <div className="upArea">
        <div className="alertArea">
            <Alert title={"미세먼지"}/>
            <Alert title={"초미세먼지"}/> 
        </div>
        <Tips />
    </div>
}

export default AlertArea