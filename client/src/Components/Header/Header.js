import React, {useState} from 'react'
import {useDispatch, useSelector} from "react-redux"
import "../../Styles/header.css"
import "../../Styles/Media-Queries/Laptop/header.css"
import "../../Styles/Media-Queries/Tablet/header.css"
import "../../Styles/Media-Queries/MobileL/header.css"
import "../../Styles/Media-Queries/MobileM/header.css"
import "../../Styles/Media-Queries/MobileS/header.css"
import { useMediaQuery } from 'react-responsive'
import {Link} from 'react-router-dom'
import Cookie from "js-cookie"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import axios from "axios"
import Auth from "../../Auth"
import SearchUsers from "./SearchUsers"

export default function Header() {

    const dispatch = useDispatch()
    const themeReducer = useSelector(state => state.Theme)
    const userDataReducer = useSelector(state => state.UserData)
    const [theme, setTheme] = useState(true)
    const [txtInput, setTxtInput] = useState("")
    const [isSearch, setIsSearch] = useState(false)
    const [dataSearch, setDataSearch] = useState(null)
    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 860px)" })
    
    const handleTheme = () => {
        dispatch({
            type: 'CHANGE',
            payload: theme
        })
        setTheme(!theme)
    }

    const handleDisconnect = () => {
        Auth.logout()
        Cookie.remove('user')
        window.location.reload();
    }

    const handleChangeInput = e => {
        if (e.target.value === "") return setIsSearch(false)
        setTxtInput(e.target.value)
    }

    const handleSearch = e => {
        const regex = /^[^@&":()!_$*€<>£`'µ§%+=;?#]+$/
        if (txtInput.length >= 1 && txtInput.match(regex)) {
            axios.get(`http://localhost:3001/api/user/search/${txtInput}`)
                .then(res => {
                    setDataSearch(res.data)
                    setIsSearch(true)
                })
                .catch(err => console.log(err))
        }
    }

    const handleKeyDown = e => {
        if (e.repeat) return

        if (e.key === "Enter") handleSearch()
    }

    return (!isTabletOrMobile ?
        <header className={themeReducer ? "header-dark" : "header"}>
            <SearchUsers isSearch={isSearch} data={dataSearch} />
            <div className="header-top">
                <div className="header-banner-box">
                    <img src={userDataReducer.bannerImage} alt="Your banner frame"/>
                </div>
                <div className="search-top">
                    <div className="search-input">
                        <button onClick={() => handleSearch()} className="search-btn"><FontAwesomeIcon className="search-icon" icon="search" /></button>
                        <input onKeyDown={e => handleKeyDown(e)} onChange={e => handleChangeInput(e)} className="search" type="search" placeholder="Search..."/>
                    </div>
                </div>
                <div className="img-profile-box">
                    <Link to={{pathname: `/account/${userDataReducer.userId}`}}>
                        <img className="img-profile" src={userDataReducer.profileImage} alt="Your profile frame"/>
                    </Link>
                </div>
            </div>

            <div className="header-middle">
                <ul className="header-middle-ul">
                    <li className="header-middle-li">
                        <div className={themeReducer ? "header-middle-icon-box-dark" : "header-middle-icon-box"}>
                            <FontAwesomeIcon className="home-icon header-middle-icon" icon="home" />
                        </div>
                        <div className="header-middle-text">
                            <Link to="/" className={themeReducer ? "header-middle-link-dark" : "header-middle-link"} >Home</Link>
                        </div>
                    </li>
                    <li className="header-middle-li">
                        <div className={themeReducer ? "header-middle-icon-box-dark" : "header-middle-icon-box"}>
                            <FontAwesomeIcon className="header-account-icon header-middle-icon" icon="user-circle" />
                        </div>
                        <div className="header-middle-text">
                            <Link to={{pathname: `/account/${userDataReducer.userId}`}} className={themeReducer ? "header-middle-link-dark" : "header-middle-link"} >Account</Link>
                        </div>
                    </li>
                    <li className="header-middle-li">
                        <div className={themeReducer ? "header-middle-icon-box-dark" : "header-middle-icon-box"}>
                            <FontAwesomeIcon className="gaming-icon header-middle-icon" icon="gamepad" />
                        </div>
                        <div className="header-middle-text">
                            <Link to="/gaming" className={themeReducer ? "header-middle-link-dark" : "header-middle-link"}>Gaming</Link>
                        </div>
                    </li>
                    <li className="header-middle-li">
                        <div className={themeReducer ? "header-middle-icon-box-dark" : "header-middle-icon-box"}>
                            <FontAwesomeIcon className="chat-icon header-middle-icon" icon="comments" />
                        </div>
                        <div className="header-middle-text">
                            <Link to="/chat/empty" className={themeReducer ? "header-middle-link-dark" : "header-middle-link"} >Chat</Link>
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
    : 
        <header className={themeReducer ? "header-dark" : "header"}>
            <SearchUsers isSearch={isSearch} setIsSearch={setIsSearch} data={dataSearch} />

        <div className="header-content-top">
            <div className={isSearch ? "serach-top isSearch" : "search-top"}>
                <div className="search-input">
                    <button onClick={() => handleSearch()} className="search-btn"><FontAwesomeIcon className={isSearch ? "search-icon isSearch-icon" : "search-icon"} icon="search" /></button>
                    <input onKeyDown={e => handleKeyDown(e)} onChange={e => handleChangeInput(e)} className="search" type="search" placeholder="Search..."/>
                </div>
            </div>

            <button className="header-bottom-btn btnHelp"><FontAwesomeIcon icon="question-circle"/> Help</button>
            <button className="header-bottom-btn btnDisconnection" onClick={() => handleDisconnect()}>Disconnection</button>

            <label className="switch" onChange={handleTheme} >
                <input type="checkbox" />
                <span className="slider round"></span>
            </label>
        </div>

        <div className="header-content">
            <div className="header-middle">
                <ul className="header-middle-ul">
                    <li className="header-middle-li">
                        <div className={themeReducer ? "header-middle-icon-box-dark" : "header-middle-icon-box"}>
                            <FontAwesomeIcon className="home-icon header-middle-icon" icon="home" />
                        </div>
                        <div className="header-middle-text">
                            <Link to="/" className={themeReducer ? "header-middle-link-dark" : "header-middle-link"} >Home</Link>
                        </div>
                    </li>
                    <li className="header-middle-li">
                        <div className={themeReducer ? "header-middle-icon-box-dark" : "header-middle-icon-box"}>
                            <FontAwesomeIcon className="header-account-icon header-middle-icon" icon="user-circle" />
                        </div>
                        <div className="header-middle-text">
                            <Link to={{pathname: `/account/${userDataReducer.userId}`}} className={themeReducer ? "header-middle-link-dark" : "header-middle-link"} >Account</Link>
                        </div>
                    </li>
                    <li className="header-middle-li">
                        <div className={themeReducer ? "header-middle-icon-box-dark" : "header-middle-icon-box"}>
                            <FontAwesomeIcon className="gaming-icon header-middle-icon" icon="gamepad" />
                        </div>
                        <div className="header-middle-text">
                            <Link to="/gaming" className={themeReducer ? "header-middle-link-dark" : "header-middle-link"}>Gaming</Link>
                        </div>
                    </li>
                    <li className="header-middle-li">
                        <div className={themeReducer ? "header-middle-icon-box-dark" : "header-middle-icon-box"}>
                            <FontAwesomeIcon className="chat-icon header-middle-icon" icon="comments" />
                        </div>
                        <div className="header-middle-text">
                            <Link to="/chat/empty" className={themeReducer ? "header-middle-link-dark" : "header-middle-link"} >Chat</Link>
                        </div>
                    </li>
                </ul>
            </div> 
        </div>

    </header>
    )
}
