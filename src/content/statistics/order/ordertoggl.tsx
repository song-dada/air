import React, { useRef, useEffect, useState } from "react";

const OrderToggl = (props: any) => {
    const [orderState, setOrderState] = useState<string>('asc');
    const [select, setSelect] = useState<boolean>(false);

    useEffect(() => {
        props.onSetOrder(orderState);
    }, [orderState])

    const chanVal = (id: any) => {
        if (id !== orderState) { // 아이디와 지금 상태가 같지 않다면 실행
            setOrderState(id);
            setSelect(prev => !prev);
        }
    }

    return (
        <div className="label">
            <label>
                <input type="radio" name="order" id="asc" checked={!select} onClick={(e) => chanVal(e.currentTarget.id)} />
                <span>오름차순</span>
            </label>
            <label>
                <input type="radio" name="order" id="desc" checked={select} onClick={(e) => chanVal(e.currentTarget.id)} />
                <span>내림차순</span>
            </label>
        </div>
    )
}

export default OrderToggl;