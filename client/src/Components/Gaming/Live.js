import React from 'react'
import "../../Styles/gaming.css"
import ReactTwitchEmbedVideo from "react-twitch-embed-video"
import {Link, useParams} from "react-router-dom"
import {useSelector} from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"

// Components
import Header from "../Header/Header"
import Connected from "../Connected/Connected"

export default function Live() {

    let {slug} = useParams()
    const themeReducer = useSelector(state => state.Theme)

    return (
        <section className="gaming">
            <div className={themeReducer? "mainLive-dark" : "mainLive"}>
                <div className="live-stream">
                    <ReactTwitchEmbedVideo 
                        width="100%" 
                        height="100%" 
                        channel={slug} 
                        theme={themeReducer? "dark" : "light"} 
                    />
                </div>
                <div className="live-back">
                    <Link to="/gaming">
                        <FontAwesomeIcon className={themeReducer? "chevron-icon-dark" : "chevron-icon"} icon="chevron-left" />
                    </Link>
                </div>                
            </div>
        </section>
    )
}
