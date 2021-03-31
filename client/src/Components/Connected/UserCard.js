import React from 'react'
import {useSelector} from "react-redux"
import "../../Styles/connected.css"

export default function UserCard({ noOpen, noGreenBubble, open, text, data}) {

    const themeReducer = useSelector(state => state.Theme)

    const handleCutText = () => {
        let newText = data.text

        if (data.type === "image") {
            return `Last message: Sended an image !`      
        } else if (data.type === "gif") {
            return `Last message: Sended a gif !`      
        } else {           
            return `Last message: ${newText.substr(0, 15)} ...`          
        }
    }

    return (
        <div className="friend-box">             
            <div className="friend-connected">
                <div className="friend-info">                  
                    <div className={noGreenBubble ? "connected-img-friend-tall" : "connected-img-friend"}>
                        <img src={data.profileImage} alt="Frame profile of your friend" onClick={open}/>
                    </div>
                    <div className={noGreenBubble ? "connected-name-friend-tall" : "connected-name-friend"}>
                        <p className={themeReducer ? "connected-name-dark" : null} onClick={() => noOpen ? null : open()}>{data.lastName} {data.firstName}</p>
                    </div>
                </div>
                {noGreenBubble ? null : <div className="connected-circle"></div>}
            </div>
            <div className="friend-text">
                {text ? <p className={themeReducer ? "connected-lastMsg-dark" : null}>{handleCutText()}</p> : null}             
            </div>
        </div>
    )
}
