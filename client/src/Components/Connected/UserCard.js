import React from 'react'
import {useSelector} from "react-redux"
import "../../Styles/connected.css"

export default function UserCard({ open, text, data}) {

    const themeReducer = useSelector(state => state.Theme)

    const handleCutText = () => {
        let newText = data.text
        if (data.type === "image") {
            return `Send an image !`
        } else {
            return newText.substr(0, 15) + " ..."
        }
    }

    return (
        <div className="friend-box">             
            <div className="friend-connected">
                <div className="friend-info">                  
                    <div className="connected-img-friend">
                        <img src={data.profileImage} alt="Frame profile of your friend" onClick={open}/>
                    </div>
                    <div className="connected-name-friend">
                        <p className={themeReducer ? "connected-name-dark" : null} onClick={() => open()}>{data.lastName} {data.firstName}</p>
                    </div>
                </div>
                <div className="connected-circle"></div>
            </div>
            <div className="friend-text">
                {text ? <p className={themeReducer ? "connected-lastMsg-dark" : null}>{handleCutText()}</p> : null}             
            </div>
        </div>
    )
}
