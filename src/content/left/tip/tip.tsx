import { useState } from 'react';
import './tip.scss'

function Tips() {
    const comment = {
        usual: [
            "외출시 보건용 마스크를 착용하세요",
            "2",
            "3",
            "4",
        ],
        warning: [
            "위험함",
            "위험함12",
            "위험함12345",
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