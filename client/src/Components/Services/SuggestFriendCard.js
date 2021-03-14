import React from 'react'
import "../../Styles/services.css"
import {useSelector} from "react-redux"
import jsp from "../../Assets/Images/story1.jpg"

export default function SuggestFriendCard() {

    const themeReducer = useSelector(state => state.Theme)

    return (
        <div className={themeReducer ? "suggestFriendCard-dark" : "suggestFriendCard"}>
            <div className="suggestFriendCard-top">
                <img src={jsp} alt=""/>
            </div>
            <div className="suggestFriendCard-bottom">
                <p className={themeReducer ? "txt-dark" : null}>Tom Mohy</p>
                <button className={themeReducer ? "suggestFriendCard-btn-dark" : "suggestFriendCard-btn"}>Add friend</button>
            </div>
        </div>
    )
}
