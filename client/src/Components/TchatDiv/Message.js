import React from 'react'

export default function Message({data, isMe}) {
    return (
        <div className={isMe ? "msg-box msg-right-box" : "msg-box"}>
            <div className={isMe ? "msg msg-right" : "msg"}>
                <p className="msg-txt">{data.text}</p>
            </div>
        </div>
    )
}
