import React, {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux"

export default function TchatEmpty() {

    const dispatch = useDispatch();
    const themeReducer = useSelector(state => state.Theme)

    useEffect(() => {
        dispatch({
            type: "CHANGE_ZINDEX",
            payload: true
        })
    }, [])

    return (
        <div className={themeReducer ? "tchatEmpty-dark" : "tchatEmpty"}>
            <p>Click on a friend</p>
        </div>
    )
}
