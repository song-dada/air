import React, { useState, useEffect, useRef } from 'react';
// hyomin
const Clock = () => {
    const nowClock = () => {
        const today = new Date();
        const hour = ("00" + today.getHours().toString()).slice(-2);
        const min = ("00" + today.getMinutes().toString()).slice(-2);
        const sec = ("00" + today.getSeconds().toString()).slice(-2);

        return `${hour}:${min}:${sec}`
    }

    const nowDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = ("00" + (today.getMonth() + 1).toString()).slice(-2);
        const day = ("00" + today.getDate().toString()).slice(-2);

        return `${year}.${month}.${day}.`
    }

    const [todayC, setTodayC] = useState(nowClock);
    const [todayD, setTodayD] = useState(nowDate);

    useEffect(() => {
        const timer = setTimeout(() => {
            setTodayC(nowClock);
        }, 1000)

        const dateArea = setTimeout(() => {
            setTodayD(nowDate);
        }, 24 * 60 * 60 * 1000)

        return () => {
            clearTimeout(timer);
            clearTimeout(dateArea);
        }

    }, [todayC, todayD])

    return (
        <div className='clockArea'>
            <p>{todayD}</p>
            <p>{todayC}</p>
        </div>
    )
}

export default Clock;