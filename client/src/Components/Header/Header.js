import React, {useState} from 'react'
import {useDispatch, useSelector} from "react-redux"
import "../../Styles/header.css"
import {Link, useHistory} from 'react-router-dom'
import Cookie from "js-cookie"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"

export default function Header() {

    const history = useHistory()
    const [theme, setTheme] = useState(true)
    const dispatch = useDispatch()
    const themeReducer = useSelector(state => state.Theme)
    const userDataReducer = useSelector(state => state.UserData)
    
    const handleTheme = () => {
        dispatch({
            type: 'CHANGE',
            payload: theme
        })
        setTheme(!theme)
    }

    const handleDisconnect = () => {
        Cookie.remove('user')
        history.push({pathname: '/'})
        window.location.reload();
    }

    return (
        <header className={themeReducer ? "header-dark" : "header"}>
            <div className="header-top">
                <div className="header-banner-box">
                    <img src={userDataReducer.bannerImageUrl} alt="Your banner frame"/>
                </div>
                <div className={themeReducer ? "search-top-dark" : "search-top"}>
                    <FontAwesomeIcon className="search-icon" icon="search" />
                    <input className={themeReducer ? "search txt-dark" : "search"} type="search" placeholder="Search..."/>
                </div>
                <div className="img-profile-box">
                    <Link to={{pathname: `/account/${userDataReducer.userId}`}}>
                        <img className="img-profile" src={userDataReducer.profileImageUrl} alt="Your profile frame"/>
                    </Link>
                </div>
            </div>

            <div className="header-middle">
                <ul className="header-middle-ul">
                    <li className="header-middle-li">
                        <FontAwesomeIcon className={themeReducer ? "home-icon header-middle-icon-dark" : "home-icon header-middle-icon"} icon="home" />
                        <div className="header-middle-text">
                            <Link to="/" className={themeReducer ? "header-middle-link-dark" : "header-middle-link"} >Home</Link>
                        </div>
                    </li>
                    <li className="header-middle-li">
                        <FontAwesomeIcon className={themeReducer ? "header-account-icon header-middle-icon-dark" : "header-account-icon header-middle-icon"} icon="user-circle" />
                        <div className="header-middle-text">
                            <Link to={{pathname: `/account/${userDataReducer.userId}`}} className={themeReducer ? "header-middle-link-dark" : "header-middle-link"} >Account</Link>
                        </div>
                    </li>
                    <li className="header-middle-li">
                        <FontAwesomeIcon className={themeReducer ? "gaming-icon header-middle-icon-dark" : "gaming-icon header-middle-icon"} icon="gamepad" />
                        <div className="header-middle-text">
                            <Link to="/gaming" className={themeReducer ? "header-middle-link-dark" : "header-middle-link"}>Gaming</Link>
                        </div>
                    </li>
                    <li className="header-middle-li">
                        <FontAwesomeIcon className={themeReducer ? "friends-icon header-middle-icon-dark" : "friends-icon header-middle-icon"} icon="comments" />
                        <div className="header-middle-text">
                            <Link to="/tchat" className={themeReducer ? "header-middle-link-dark" : "header-middle-link"} >Friends</Link>
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
                <button className="header-bottom-btn btnDisconnection" onClick={() => handleDisconnect()}>Disconnection</button>
            </div>
        </header>
    )
}
