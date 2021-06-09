import React, {useState, useRef} from 'react'
import "../../Styles/publication.css"
import "../../Styles/Media-Queries/Tablet/publication.css"
import {useSelector} from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import axios from "axios"
import imageCompression from "browser-image-compression"
import {useTransition, animated, config} from "react-spring"
import Loader from "../Services/Loader"

export default function NewPubliBox({ setPubli }) {

    const themeReducer = useSelector(state => state.Theme)
    const userDataReducer = useSelector(state => state.UserData)
    const openFile = useRef(null)
    const textareaRef = useRef(null)
    const hashtagValue = useRef("")
    const [fileIsVisible ,setFileIsVisible] = useState(false)
    const [fileVisible, setFileVisible] = useState(null)
    const [dataFile, setDataFile] = useState(null)
    const [isSend, setIsSend] = useState(false)
    const [alertMsg, setAlertMsg] = useState("")
    const [alertCss, setAletCss] = useState(true)
    const [newHashtag, setNewHashtag] = useState("")
    const [isAnimated, setIsAnimated] = useState(true)
    const transitionContent = useTransition(isAnimated, null, {
        from: {opacity: 0, transform: "scale(0)"},
        enter: {opacity: 1, transform: "scale(1)"},
        leave: {opacity: 0, transform: "scale(0)"},
        config: config.stiff
    })
    const transitionContentOpacity = useTransition(isAnimated, null, {
        from: {opacity: 0},
        enter: {opacity: 0.5},
        leave: {opacity: 0},
        config: config.stiff
    })
    const [data, setData] = useState({
        text: "",
        hashtag: []
    })

    const verifyInformations = () => {
        let regex = /^[^@&":()!_$*€<>£`'µ§%+=;?#]+$/

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

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!isSend) {
            // Publication text
            if (verifyInformations()) {
                setIsSend(true)
                axios.post(`${process.env.REACT_APP_URL}api/publications/add/publication/${userDataReducer.userId}`, data)
                    .then(res => {
                        if (res.data.alert) {
                            if (dataFile != null) {
                                if (dataFile.type.includes("image")) {
                                    // Image
                                    handleCompressionImage(res.data.publicationId)
                                } else {
                                    // Video
                                    let formData = new FormData()
                                    formData.append('video', dataFile)
                                    formData.append('id', res.data.publicationId)
                                    axios.post(`${process.env.REACT_APP_URL}api/publications/add/video`, formData)
                                        .then(res => {
                                            setIsSend(false)
                                            setData({
                                                text: "",
                                                hashtag: []
                                            })
                                            setNewHashtag("")
                                            textareaRef.current.value = ""
                                            setFileIsVisible(false)
                                            setDataFile(null)
                                            setAletCss(false)
                                            setAlertMsg(res.data.message)
                                        })
                                        .catch(err => console.log(err))
                                }
                            } else {
                                setIsSend(false)
                                setAletCss(false)
                                setData({
                                    text: "",
                                    hashtag: []
                                })
                                setNewHashtag("")
                                textareaRef.current.value = ""
                                setFileIsVisible(false)
                                setDataFile(null)
                                setAlertMsg("Publications published !")
                            }
                        }
                    })
                    .catch(err => console.log(err))
            }
        }
    }

    const handleClosePublication = () => {
        setIsAnimated(!isAnimated)
        setTimeout(() => {
            setPubli(false)
        }, 200);
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
        hashtagValue.current.value = ""
    }

    const handleClickFile = () => {
        openFile.current.click()
    }

    // Image compression
    const handleCompressionImage = (publicationId) => {
        let imageFile = dataFile;    
        let options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        }

        imageCompression(imageFile, options)
          .then(compressedFile => {
                let formData = new FormData()
                formData.append('file', compressedFile)
                formData.append('id', publicationId)
                axios.post(`${process.env.REACT_APP_URL}api/publications/add/image`, formData)
                    .then(res => {
                        setIsSend(false)
                        setData({
                            text: "",
                            hashtag: []
                        })
                        setNewHashtag("")
                        textareaRef.current.value = ""
                        setFileIsVisible(false)
                        setDataFile(null)
                        setAletCss(false)
                        setAlertMsg(res.data.message)
                    })
                    .catch(err => console.log(err))
          })
          .catch(err => {console.log(err)})
      }
      

    const handleChangeFile = e => {
        if (typeof e.target.files[0] !== "undefined") {
            setFileVisible(URL.createObjectURL(e.target.files[0]))
            setDataFile(e.target.files[0])
            setFileIsVisible(true)
        } 
    }

    const handleRemoveImg = () => {
        setFileIsVisible(false)
        setDataFile(null)
    }

    return (
        <div className="new-publi-container">
            {transitionContentOpacity.map(({item, key, props}) => item && (
                <animated.div key={key} style={props} className="new-publi-opacity"></animated.div>
            ))}
            {transitionContent.map(({item, key, props}) => item && (
                <animated.div key={key} style={props} className={themeReducer ? "new-publi-content-dark" : "new-publi-content"}>
                <button className={themeReducer ? "new-publi-icon-btn-dark" : "new-publi-icon-btn"} onClick={() => handleClosePublication()}>
                    <FontAwesomeIcon icon="times-circle" className="new-publi-close-icon"/>
                </button>  
                {isSend ? <div className="new-publi-loader"><Loader isMini={true} /></div> : null}          
                {alertMsg === "" 
                ?   null 
                :   <div className={alertCss ? "alert-danger" : "alert-success"}>
                        <p>{alertMsg}</p>
                    </div>
                }
                <form className="new-publi-form" onSubmit={e => handleSubmit(e)}>  
                        {fileIsVisible 
                        ? <div className="new-publi-img-box">
                            <button className="new-publi-icon-btn-img" onClick={() => handleRemoveImg()}>
                                <FontAwesomeIcon icon="times-circle" className="new-publi-close-icon-img"/>
                            </button>    
                            {dataFile.type.includes("image") 
                            ?   <img src={fileVisible} alt="Your publication frame" className="new-publi-img"/>
                            :   <video alt="Your publication frame" className="new-publi-img">
                                    <source src={fileVisible} type={dataFile.type} />
                                </video>
                            }
                        </div>
                        : null} 
                    <div className={themeReducer ? "new-publi-box-dark" : "new-publi-box"}>
                        <FontAwesomeIcon className={themeReducer ? "icon-new-publi-dark" : "icon-new-publi"} icon="comments" />
                        <textarea name="text" ref={textareaRef} className={themeReducer ? "new-publi-textarea textarea-dark" : "new-publi-textarea"} placeholder="What do you mean ?" onChange={e => handleChange(e)}></textarea>
                    </div>
                    <div className="bottom-new-publi">
                        <button className="new-publi-btn-noVisible" type="button"><FontAwesomeIcon icon="photo-video" className={themeReducer ? "icon-write-new-publi-dark" : "icon-write-new-publi"} onClick={handleClickFile}/></button>
                        <input type="file" name="newPubliFile" id="newPubliFile" style={{display: "none"}} ref={openFile} onChange={e => handleChangeFile(e)} />
                    </div>
                    <div className={themeReducer ? "new-publi-hashtag-box-dark" : "new-publi-hashtag-box"}>
                        <div className="new-publi-hashtag-txt-box">
                            {data.hashtag.map((item, index) => {
                                return (
                                    <p key={index} className={themeReducer ? "new-publi-hashtag-txt-dark" : "new-publi-hashtag-txt" }>{item}</p>
                                )
                            })}
                        </div>
                        <input className={themeReducer ? "new-publi-input-hashtag-dark" : "new-publi-input-hashtag"} ref={hashtagValue} name="hashtag" type="text" placeholder="#..." onChange={e => setNewHashtag(e.target.value)}/>
                        <button type="button" className={themeReducer ? "new-publi-hashtag-btn-dark" : "new-publi-hashtag-btn"} onClick={() => handleChangeHashtag()}>ADD</button>
                    </div>
                    <button className={themeReducer ? "new-publi-btn-dark" : "new-publi-btn"}>PUBLISH</button>
                </form>
            </animated.div>
            ))}   
        </div>
    )
}
