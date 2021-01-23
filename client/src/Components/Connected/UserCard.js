import React from 'react'
import {useSelector} from "react-redux"
import "../../Styles/connected.css"
import ProfilDefault from "../../Assets/Images/profil_publication1.jpg"

export default function UserCard(props) {

    const themeReducer = useSelector(state => state.Theme)

    return (
        <div className="friend-box">             
            <div className="friend-connected">
                <div className="friend-info">                  
                    <div className="connected-img-friend">
                        <img src={ProfilDefault} alt="Frame profile of your friend" onClick={props.open}/>
                    </div>
                    <div className="connected-name-friend">
                        <p className={themeReducer ? "connected-name-dark" : null} onClick={props.open}>Tom Mohy</p>
                    </div>
                </div>
                    <div className="connected-circle"></div>
            </div>
            <div className="friend-text">
                {props.text ? <p className={themeReducer ? "connected-lastMsg-dark" : null}>Lorem ipsum dolor sit.</p> : null}             
            </div>
        </div>
    )
}
