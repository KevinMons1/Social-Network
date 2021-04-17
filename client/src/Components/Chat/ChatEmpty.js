import React, {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux"

export default function ChatEmpty() {

    const dispatch = useDispatch();
    const themeReducer = useSelector(state => state.Theme)

    useEffect(() => {
        dispatch({
            type: "CHANGE_ZINDEX",
            payload: true
        })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={themeReducer ? "chatEmpty-dark" : "chatEmpty"}>
            <p>Click on a friend</p>
        </div>
    )
}
