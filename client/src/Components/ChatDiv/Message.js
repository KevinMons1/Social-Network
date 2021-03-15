import React from 'react'
import {useSelector} from "react-redux"
import moment from "moment"

export default function Message({data, isMe}) {

    const isImage = data.type === "image" ? true : null
    const themeReducer = useSelector(state => state.Theme)
    const smallClass = isMe ? themeReducer ? 'txt-dark msg-hour msg-hour-right' : "msg-hour msg-hour-right" : themeReducer ? 'txt-dark msg-hour msg-hour-left' : 'msg-hour msg-hour-left'
    const divClass = isImage === "image" ? isMe ? "msg-box-img-right" : "msg-box-img" : isMe ? "msg msg-right" : "msg"

    const handleType = () => {
        switch (data.type) {
            case "text":
                return <p className="msg-txt">{data.text}</p>
                break;

            case "image":
                return <img className="msg-img" src={data.text} alt="frame message"/>
                break;

            case "gif":
                return <iframe className="msg-gif" src={data.text} alt="Gif"></iframe>
                break;

            default:
                return null
                break;
        }
    }

    return (
        <div className={isMe ? "msg-box msg-right-box" : "msg-box"}>
                <div className={divClass}>
                    <small className={smallClass}>{moment(data.date).fromNow()}</small>
                    { handleType() }
                </div>
        </div>
    )
}
