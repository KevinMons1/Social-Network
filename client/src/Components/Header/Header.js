import React, {useState, useRef, useEffect} from 'react'
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
import Notification from '../Notification/Notification'

export default function Header({ openInformations }) {

    const themeCookie = Cookie.get("theme")
    const checkRef = useRef()
    const dispatch = useDispatch()
    const themeReducer = useSelector(state => state.Theme)
    const userDataReducer = useSelector(state => state.UserData)
    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 860px)" })
    const [isOk, setIsOk] = useState(false)
    const [txtInput, setTxtInput] = useState("")
    const [isSearch, setIsSearch] = useState(false)
    const [dataSearch, setDataSearch] = useState(null)
    const [newTheme, setNewTheme] = useState(null)

    useEffect(() => {
        if (themeCookie === "true") checkRef.current.click()
        setNewTheme(themeCookie === "true" ? true : false)
        setIsOk(true)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    
    const handleTheme = () => {
        if (isOk) {
            dispatch({
                type: 'CHANGE',
                payload: !newTheme
            })
            Cookie.set("theme", !newTheme)
            setNewTheme(newTheme => !newTheme)
        }
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
            axios.get(`${process.env.REACT_APP_URL}api/user/search/${txtInput}`)
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
            <SearchUsers isSearch={isSearch} data={dataSearch} setIsSearch={() => setIsSearch(false)} />
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
                    <input ref={checkRef} type="checkbox" />
                    <span className="slider round"></span>
                </label>
                <div className="header-bottom-btns">
                    <button className={themeReducer ? "header-bottom-btn-dark" : "header-bottom-btn"} onClick={() => openInformations()}><FontAwesomeIcon icon="question-circle"/></button>
                    <button className={themeReducer ? "header-bottom-btn-dark" : "header-bottom-btn"} onClick={() => handleDisconnect()}><FontAwesomeIcon icon="sign-out-alt"/></button>            </div>
                </div>
        </header>
    : 
        <header className={themeReducer ? "header-dark" : "header"}>
            <SearchUsers isSearch={isSearch} setIsSearch={() => setIsSearch(false)} data={dataSearch} />

        <div className="header-content-top">
            <button className={themeReducer ? "header-bottom-btn-dark" : "header-bottom-btn"} onClick={() => handleDisconnect()}><FontAwesomeIcon icon="sign-out-alt"/></button>
            <button className={themeReducer ? "header-bottom-btn-dark" : "header-bottom-btn"} onClick={() => openInformations()}><FontAwesomeIcon icon="question-circle"/></button>

            <div className={isSearch ? "serach-top isSearch" : "search-top"}>
                <div className="search-input">
                    <button onClick={() => handleSearch()} className="search-btn"><FontAwesomeIcon className={isSearch ? "search-icon isSearch-icon" : "search-icon"} icon="search" /></button>
                    <input onKeyDown={e => handleKeyDown(e)} onChange={e => handleChangeInput(e)} className="search" type="search" placeholder="Search..."/>
                </div>
            </div>

            <label className="switch" ref={checkRef} onChange={() => handleTheme()} >
                <input  type="checkbox" />
                <span className="slider round"></span>
            </label>
        </div>

        <div className="header-content">
            <div className="header-middle">
                <ul className="header-middle-ul">
                    <li className="header-middle-li">
                        <div className={themeReducer ? "header-middle-icon-box-dark" : "header-middle-icon-box"}>
                            <Link to="/" className={themeReducer ? "header-middle-link-dark" : "header-middle-link"}>
                                <FontAwesomeIcon className="home-icon header-middle-icon" icon="home" />
                            </Link>
                        </div>
                    </li>
                    <li className="header-middle-li">
                        <div className={themeReducer ? "header-middle-icon-box-dark" : "header-middle-icon-box"}>
                            <Link to={{pathname: `/account/${userDataReducer.userId}`}} className={themeReducer ? "header-middle-link-dark" : "header-middle-link"} >
                                <FontAwesomeIcon className="header-account-icon header-middle-icon" icon="user-circle" />
                            </Link>
                        </div>
                    </li>
                    <li className="header-middle-li">
                        <div className={themeReducer ? "header-middle-icon-box-dark" : "header-middle-icon-box"}>
                            <Link to="/gaming" className={themeReducer ? "header-middle-link-dark" : "header-middle-link"}>
                                <FontAwesomeIcon className="gaming-icon header-middle-icon" icon="gamepad" />
                            </Link>
                        </div>
                    </li>
                    <li className="header-middle-li">
                        <div className={themeReducer ? "header-middle-icon-box-dark" : "header-middle-icon-box"}>
                            <Link to="/chat/empty" className={themeReducer ? "header-middle-link-dark" : "header-middle-link"} >
                                <FontAwesomeIcon className="chat-icon header-middle-icon" icon="comments" />
                            </Link>
                        </div>
                    </li>
                    <li className="header-middle-li">
                        <Notification choiceCss={false} />
                    </li>
                </ul>
            </div> 
        </div>
    </header>
    )
}
