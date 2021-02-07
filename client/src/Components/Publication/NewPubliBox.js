import React, {useState} from 'react'
import "../../Styles/publication.css"
import {useSelector} from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import axios from "axios"

export default function NewPubliBox({ setPubli }) {

    const themeReducer = useSelector(state => state.Theme)
    const userDataReducer = useSelector(state => state.UserData)
    const [alertMsg, setAlertMsg] = useState("")
    const [alertCss, setAletCss] = useState(true)
    const [newHashtag, setNewHashtag] = useState("")
    const [data, setData] = useState({
        text: "",
        hashtag: []
    })

    const verifyInformations = () => {
        let regex = /^[^@&":()!_$*€<>£`'µ§%+=;?#]+$/

        console.log(data.text.length)
        if (data.text.length > 2) {
            if (data.hashtag.length === 0) {
                return true
            } else {
                for (let i = 0; i < data.hashtag.length; i++) {
                    if (data.hashtag[i].match(regex)) {
                        return true
                    } else {
                        setAletCss(true)
                        setAlertMsg("Do not use special characters for your hashtag !")
                        return false
                    }
                }
            }   
        } else {
            setAletCss(true)
            setAlertMsg("Your text must contain at least 2 characters !")
            return false
        }

    }

    const handleSubmit = e => {
        e.preventDefault()
        
        if (verifyInformations()) {
            axios.post(`http://localhost:3001/api/publications/add/${userDataReducer.user_id}`, data)
                .then(res => {
                    setAletCss(false)
                    setAlertMsg(res.data.message)
                })
                .catch(err => console.log(err))
        }
    }

    const handleClosePublication = () => {
        setPubli(false)
    }
    
    const handleChange = e => {
        setData({...data, [e.target.name]: e.target.value})
    }

    const handleChangeHashtag = () => {
        if (data.hashtag.length >= 3) {
            setAletCss(true)
            setAlertMsg("You cannot use more than 3 hashtags !")
        } else {
            let hashtagSplit = newHashtag.split(" ").join("");
            setData({...data, hashtag: [...data.hashtag, hashtagSplit]})
        }
    }

    return (
        <div className="new-publi-container">
            <div className="new-publi-opacity"></div>
            <div className={themeReducer ? "new-publi-content-dark" : "new-publi-content"}>
                <button className={themeReducer ? "new-publi-icon-btn-dark" : "new-publi-icon-btn"} onClick={handleClosePublication}><FontAwesomeIcon icon="times-circle" className="new-publi-close-icon"/></button>
                {alertMsg === "" 
                ?   null 
                :   <div className={alertCss ? "alert-danger" : "alert-success"}>
                        <p>{alertMsg}</p>
                    </div>
                }
                <form className="new-publi-form" onSubmit={e => handleSubmit(e)}>          
                    <div className={themeReducer ? "new-publi-box-dark" : "new-publi-box"}>
                        <FontAwesomeIcon className={themeReducer ? "icon-new-publi-dark" : "icon-new-publi"} icon="comments" />
                        <textarea name="text" className={themeReducer ? "new-publi-textarea textarea-dark" : "new-publi-textarea"} placeholder="What do you mean ?" onChange={e => handleChange(e)}></textarea>
                    </div>
                    <div className="bottom-new-publi">
                        <FontAwesomeIcon icon="image" className="icon-write-new-publi"/>
                        <p className="icon-write-new-publi">GIF</p>
                    </div>
                    <div className={themeReducer ? "new-publi-hashtag-box-dark" : "new-publi-hashtag-box"}>
                        <div className="new-publi-hashtag-txt-box">
                            {data.hashtag.map((item, index) => {
                                return (
                                    <p key={index} className={themeReducer ? "new-publi-hashtag-txt-dark" : "new-publi-hashtag-txt" }>{item}</p>
                                )
                            })}
                        </div>
                        <input className={themeReducer ? "new-publi-input-hashtag-dark" : "new-publi-input-hashtag"} name="hashtag" type="text" placeholder="#..." onChange={e => setNewHashtag(e.target.value)}/>
                        <button type="button" className={themeReducer ? "new-publi-hashtag-btn-dark" : "new-publi-hashtag-btn"} onClick={() => handleChangeHashtag()}>ADD</button>
                    </div>
                    <button className={themeReducer ? "new-publi-btn-dark" : "new-publi-btn"}>PUBLISH</button>
                </form>
            </div>
        </div>
    )
}
