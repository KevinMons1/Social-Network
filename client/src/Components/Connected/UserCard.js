import React, {useState, useEffect} from 'react'
import {useSelector} from "react-redux"
import "../../Styles/connected.css"

export default function UserCard({ noOpen, tallCard, open, text, data, isConnected, isView }) {

    const themeReducer = useSelector(state => state.Theme)
    const [view, setView] = useState(false)

    useEffect(() => {
        setView(isView)
    }, [isView])

    const handleCutText = () => {
        if (data.type === "image") return `Last message: Sended an image !`
        else if (data.type === "gif") return `Last message: Sended a gif !`
        else return data.text.length < 15 ? `Last message: ${data.text}` : `Last message: ${data.text.substr(0, 15)} ...`     
    }

    const handleClick = () => {
        if (!noOpen) open()
    }

    return (
        <div className="friend-box">             
            <div className="friend-connected">
                <div className="friend-info">                  
                    <div className={tallCard ? "connected-img-friend-tall" : "connected-img-friend"}>
                        <img src={data.profileImage} alt="Frame profile of your friend" onClick={open}/>
                    </div>
                    <div className={tallCard ? "connected-name-friend-tall" : "connected-name-friend"}>
                        <p className={themeReducer ? "connected-name-dark" : null} onClick={() => handleClick()}>{data.lastName} {data.firstName}</p>
                    </div>
                </div>
                {tallCard ? null : isConnected ? <div className="connected-circle"></div> : null}
            </div>
            <div className={view ? "friend-text friend-view" : "friend-text"}>
                {text ? <p className={themeReducer ? "connected-lastMsg-dark" : null}>{handleCutText()}</p> : null}  
                {view ? <div className="friend-text-new"></div> : null}           
            </div>
        </div>
    )
}
