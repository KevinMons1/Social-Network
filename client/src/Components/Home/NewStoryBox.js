import React, {useState, useRef} from 'react'
import "../../Styles/publication.css"
import {useSelector} from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import axios from "axios"
import imageCompression from "browser-image-compression"
import {useTransition, animated, config} from "react-spring"

export default function NewStoryBox({ setPubli }) {

    const themeReducer = useSelector(state => state.Theme)
    const userDataReducer = useSelector(state => state.UserData)
    const openFile = useRef(null)
    const [fileIsVisible ,setFileIsVisible] = useState(false)
    const [fileVisible, setFileVisible] = useState(null)
    const [dataFile, setDataFile] = useState(null)
    const [alertMsg, setAlertMsg] = useState("")
    const [alertCss, setAletCss] = useState(true)
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (dataFile.type.includes("image") && dataFile != null) {
            axios.post(`http://localhost:3001/api/publications/add/publication/${userDataReducer.userId}`, {type: "story"})
                .then(res => {
                    if (res.data.alert) {
                        if (res.data.alert) handleCompressionImage(res.data.publicationId)
                    } else {
                        setAletCss(true)
                        setAlertMsg("An error occured")
                    }
                })
                .catch(err => console.log(err))
        }
    }

    const handleClosePublication = () => {
        setIsAnimated(!isAnimated)
        setTimeout(() => {
            setPubli(false)
        }, 200);
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
                axios.post(`http://localhost:3001/api/publications/add/image`, formData)
                    .then(res => {
                        setAletCss(false)
                        setAlertMsg(res.data.message)
                    })
                    .catch(err => console.log(err))
          })
          .catch(err => {console.log(err)})
      }
      

    const handleChangeFile = e => {
        setFileVisible(URL.createObjectURL(e.target.files[0]))
        setDataFile(e.target.files[0])
        setFileIsVisible(true)
    }

    const handleRemoveImg = () => {
        setDataFile(null)
        setFileIsVisible(false)
    }

    return (
        <div className="new-publi-container">
            {transitionContentOpacity.map(({item, key, props}) => item && (
                <animated.div key={key} style={props} className="new-publi-opacity"></animated.div>
            ))}
            {transitionContent.map(({item, key, props}) => item && (
                <animated.div key={key} style={props} className={themeReducer ? "new-publi-content-dark" : "new-publi-content"}>
                <button className={themeReducer ? "new-publi-icon-btn-dark" : "new-publi-icon-btn"} onClick={handleClosePublication}>
                    <FontAwesomeIcon icon="times-circle" className="new-publi-close-icon"/>
                </button>
                {alertMsg === "" 
                ?   null 
                :   <div className={alertCss ? "alert-danger" : "alert-success"}>
                        <p>{alertMsg}</p>
                    </div>
                }
                <form className="new-publi-form" onSubmit={e => handleSubmit(e)}>          
                        {fileIsVisible 
                        ? <div className="new-publi-img-box">
                            <button className="new-publi-icon-btn-img" onClick={handleRemoveImg}>
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
                    <div className="top-new-publi">
                        <button className="new-publi-btn-noVisible" type="button"><FontAwesomeIcon icon="image" className={themeReducer ? "icon-new-publi-story-dark" : "icon-new-publi-story"} onClick={handleClickFile}/></button>
                        <input type="file" name="newPubliFile" id="newPubliFile" style={{display: "none"}} ref={openFile} onChange={e => handleChangeFile(e)} />
                    </div>
                    <button className={themeReducer ? "new-publi-btn-dark" : "new-publi-btn"}>PUBLISH</button>
                </form>
            </animated.div>
            ))}   
        </div>
    )
}
