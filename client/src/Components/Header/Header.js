import React, {useState} from 'react'
import {useDispatch, useSelector} from "react-redux"
import "../../Styles/header.css"
import {Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import ProfilDefault from "../../Assets/Images/profil_default.jpg"

export default function Header() {

    const [theme, setTheme] = useState(true)
    const dispatch = useDispatch()
    const themeReducer = useSelector(state => state)

    const handleTheme = () => {
        dispatch({
            type: 'CHANGE',
            payload: theme
        })
        setTheme(!theme)
    }

    return (
        <header className={themeReducer.Theme ? "header-dark" : "header"}>
            <div className="header-top">
                <div className={themeReducer.Theme ? "search-top-dark" : "search-top"}>
                    <FontAwesomeIcon className="search-icon" icon="search" />
                    <input className={themeReducer.Theme ? "search txt-dark" : "search"} type="search" placeholder="Search..."/>
                </div>
                <div className="img-profile-box">
                    <Link to="/account"><img className="img-profile" src={ProfilDefault} alt="Your frame profile"/></Link>
                </div>
            </div>

            <div className="header-middle">
                <ul className="header-middle-ul">
                    <li className="header-middle-li">
                        <FontAwesomeIcon className={themeReducer.Theme ? "home-icon header-middle-icon-dark" : "home-icon header-middle-icon"} icon="home" />
                        <div className="header-middle-text">
                            <Link to="/" className={themeReducer.Theme ? "header-middle-link-dark" : "header-middle-link"} >Home</Link>
                        </div>
                    </li>
                    <li className="header-middle-li">
                        <FontAwesomeIcon className={themeReducer.Theme ? "header-account-icon header-middle-icon-dark" : "header-account-icon header-middle-icon"} icon="user-circle" />
                        <div className="header-middle-text">
                            <Link to="/account" className={themeReducer.Theme ? "header-middle-link-dark" : "header-middle-link"} >Account</Link>
                        </div>
                    </li>
                    <li className="header-middle-li">
                        <FontAwesomeIcon className={themeReducer.Theme ? "gaming-icon header-middle-icon-dark" : "gaming-icon header-middle-icon"} icon="gamepad" />
                        <div className="header-middle-text">
                            <Link to="/gaming" className={themeReducer.Theme ? "header-middle-link-dark" : "header-middle-link"}>Gaming</Link>
                        </div>
                    </li>
                    <li className="header-middle-li">
                        <FontAwesomeIcon className={themeReducer.Theme ? "friends-icon header-middle-icon-dark" : "friends-icon header-middle-icon"} icon="comments" />
                        <div className="header-middle-text">
                            <Link to="/tchat" className={themeReducer.Theme ? "header-middle-link-dark" : "header-middle-link"} >Friends</Link>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="header-bottom">
                <label className="switch" onChange={handleTheme} >
                    <input type="checkbox" />
                    <span className="slider round"></span>
                </label>
                <button className="header-bottom-btn btnHelp"><FontAwesomeIcon icon="question-circle"/> Help</button>
                <button className="header-bottom-btn btnDisconnection">Disconnection</button>
            </div>
        </header>
    )
}
