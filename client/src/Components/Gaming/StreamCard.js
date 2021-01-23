import React from 'react'
import {Link} from "react-router-dom"
import {useSelector} from "react-redux"
import "../../Styles/gaming.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"

export default function StreamCard(props) {

    const themeReducer = useSelector(state => state.Theme)
    
    return (
        <div className={themeReducer ? "stream-dark" : "stream"}>
            <div className="stream-top">  
                <div className="info-stream">
                    <div className="left-stream">
                        <div className="left-stream-img-box">
                            <img className="left-stream-img" src={props.channelImg} alt="Frame profile of streamer"/>
                        </div>
                        <div className="left-stream-info">
                            <p className={themeReducer ? 'txt-dark' : null}>{props.name}</p>
                        </div>
                    </div>
                    <div className="right-stream">
                        <p className={themeReducer ? 'txt-dark' : null}>{props.gamePlay}</p>
                    </div>
                </div>

                <div className="text-stream">
                    <p className={themeReducer ? 'txt-dark' : null}><FontAwesomeIcon icon="eye" /> {props.viewerCount} </p>
                </div>
            </div>
            
            <Link 
                to={{
                    pathname: `/gaming/live/${props.login}`,
                    state: {
                        viewerCount: props.viewerCount,
                        name: props.name
                    }
                }}>
                <div className="bg-stream">
                    <img src={props.streamImg} alt="Frame of the game"/>
                </div>
            </Link>
        </div>
    )
}
