import { useState } from 'react';
import './tip.scss'

function Tips() {
    const comment = {
        usual: [
            "가급적 외출 자제하기",
            "외출시 보건용 마스크 착용하기",
            "외출시 대기오염이 심한 도로변, 공사장은 피하고 활동량 줄이기",
            "대중교통을 이용하기",
            "미세먼지 농도 수시 확인",
            "차량 2부제 대비 교통수단 점검하기",
        ],
        warning: [
            "홀수날에는 홀수 차량, 짝수날에는 짝수 차량 운행",
            "가급적 외출을 자제하고 학교에서는 실내 수업 위주로 하기",
            "이용시설 내 기계, 기구류 세척 등 위생관리 강화",
            "경보 발령시 등하교시간 조정하고 기간지가 약한 사람은 특별 관리하기",
        ]

    }
    
    const randomMessage = () => {
        const randomI = Math.floor(Math.random() * comment.usual.length);
        return comment.usual[randomI];
    }

    const [state, setState] = useState(randomMessage);

    return <div className="tipBox">
        <div className="tipMessage">{state}</div>
        <div className="imgbox">
            <div className="imgicon"></div>
        </div>
    </div>
}

export default Tips