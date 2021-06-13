import React, {useEffect, useState} from 'react'
import "../../Styles/gaming.css"
import ReactTwitchEmbedVideo from "react-twitch-embed-video"
import {Link, useParams} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import {Helmet} from "react-helmet"

export default function Live() {

    let {slug} = useParams()
    const dispatch = useDispatch()
    const themeReducer = useSelector(state => state.Theme)

    useEffect(() => {
        dispatch({
            type: "CHANGE_ZINDEX",
            payload: false
          })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <section className="gaming">
            <Helmet>
                <title>Gaming - {slug}</title>
            </Helmet>
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
