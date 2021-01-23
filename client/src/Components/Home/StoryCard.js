import React from 'react'
import {useSelector} from "react-redux"
import "../../Styles/home.css"
import StoryImage from "../../Assets/Images/story1.jpg"

export default function StoryCard() {

    const themeReducer = useSelector(state => state.Theme)

    return (
        <div className="story-container">
            <div className="story-box">
                <img className="story-img" src={StoryImage} alt="Frame of story"/>
            </div>
            <p className={themeReducer ? "story-name txt-dark" : "story-name"}>Tom</p>
        </div>
    )
}
