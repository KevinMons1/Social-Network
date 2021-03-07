import React from 'react'
import {useSelector} from "react-redux"
import moment from "moment"

export default function Message({data, isMe}) {

    const themeReducer = useSelector(state => state.Theme)

    return (
        <div className={isMe ? "msg-box msg-right-box" : "msg-box"}>
                <div className={isMe ? "msg msg-right" : "msg"}>
                    <small className={themeReducer ? 'txt-dark' : null}>{moment(data.date).fromNow()}</small>
                    <p className="msg-txt">{data.text}</p>
                </div>
        </div>
    )
}
