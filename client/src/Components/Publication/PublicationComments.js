import React, {useState, useEffect} from 'react'
import {useSelector} from "react-redux"
import {useHistory} from "react-router-dom"
import "../../Styles/publication.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import PublicationCard from "./PublicationCard"
import moment from "moment"
import Loader from "../Services/Loader"
import axios from "axios"
import {socket} from "../../Api"
import {useTransition, animated, config} from "react-spring"

export default function PublicationComments({close, data}) {

    const themeReducer = useSelector(state => state.Theme)
    const [load, setLoad] = useState(false)
    const [alertMsg, setAlertMsg] = useState("")
    const [alertCss, setAletCss] = useState(true)
    const userDataReducer = useSelector(state => state.UserData)
    const [dataComments, setDataComments] = useState([])
    const [isAnimated, setIsAnimated] = useState(true)
    const history = useHistory()
    const transition = useTransition(isAnimated, null, {
        from: {opacity: 0, transform: "scale(0)", position: 'absolute'},
        enter: {opacity: 1, transform: "scale(1)"},
        leave: {opacity: 0, transform: "scale(0)"},
        config: config.stiff
    })
    const [dataNewPubli, setDataNewPubli] = useState({
        userId: userDataReducer.userId,
        text: ""
    })

    useEffect(() => {
        setLoad(false)
        const fetchData = async () => {
            await axios.get(`http://localhost:3001/api/publications/comments/${data.publicationId}`)
                .then(res => {
                    setDataComments(res.data)
                })
                .catch(err => console.log(err))
            setLoad(true)
        }
        fetchData()
    }, [])

    const handleSubmit = e => {
        e.preventDefault()

        if (dataNewPubli.text.length > 2) {
            axios.post(`http://localhost:3001/api/publications/comments/add/${data.publicationId}`, dataNewPubli)
                .then(res => {
                    setAletCss(false)
                    setAlertMsg("Comment published !")
                    setDataComments([...dataComments, {
                        text: dataNewPubli.text,
                        userId: dataNewPubli.userId,
                        lastName: userDataReducer.lastName,
                        firstName: userDataReducer.firstName,
                        profileImage: userDataReducer.profileImage,
                        date: Date.now()
                    }])
                    axios.post("http://localhost:3001/api/notifications/add", {
                        receiver : data.userId,
                        sender: userDataReducer.userId,
                        type: "comment"
                    })
                    socket.emit("notification", {
                        receiver: data.userId,
                        sender: {
                            user: userDataReducer,
                            content: {
                                type: "comment"
                            }
                        }
                    })
                })  
                .catch(err => console.log(err))  
        } else {
            setAletCss(true)
            setAlertMsg("Your text must contain at least 2 characters !")
        }
    }

    const handleChange = e => {
        setDataNewPubli({...dataNewPubli, [e.target.name]: e.target.value})
    }
    
    const handleClose = () => {
        setIsAnimated(!isAnimated)
        setTimeout(() => {
            close()
        }, 200)
    }

    const handleClickProfile = userId => {
        history.push(`/account/${userId}`)
    }

    return (
        <div>
            {transition.map(({item, key, props}) => item && (
                <animated.div key={key} style={props} className={themeReducer ? "publi-open-dark" : "publi-open"}>
                    <div className="publi-icon">
                        <FontAwesomeIcon icon="times-circle" className="publi-icon-close" onClick={() => handleClose()} />
                    </div>
                    <div className="publi-open-bottom-container">
                        <div className="publi-open-top">
                            <PublicationCard data={data} noClick={true} />
                        </div>

                        <div style={{position: "relative"}}>
                            {load 
                            ? dataComments.map((item, index) => {
                                return (
                                    <div className={themeReducer ? "publi-open-bottom-dark" : "publi-open-bottom"} key={index}>
                                        <div className="publi-open-info-img-box">
                                            <div className="publi-open-img">
                                                <img onClick={() => handleClickProfile(item.userId)} src={item.profileImage} alt="Frame profile"/>
                                            </div>
                                        </div>
                                        <div className="publi-open-info-txt-box">
                                            <div className="publi-open-name">
                                                <p className={themeReducer ? 'txt-dark' : null}>{item.firstName} {item.lastName}</p>
                                                <small className={themeReducer ? 'txt-dark' : null}>{moment(item.date).fromNow()}</small>
                                            </div>
                                            <div className="publi-open-info">
                                                <p className={themeReducer ? "publi-open-txt txt-dark" : "publi-open-txt"}>{item.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            : <Loader />
                            }    
                        </div>  

                        <div className="new-publi">
                            {alertMsg === "" 
                            ?   null 
                            :   <div className={alertCss ? "alert-danger" : "alert-success"}>
                                    <p>{alertMsg}</p>
                                </div>
                            }
                            <form className="write-publi" onSubmit={e => handleSubmit(e)}>
                                <FontAwesomeIcon className={themeReducer ? "icon-new-publi txt-dark" : "icon-new-publi"} icon="comments" />
                                <div className="input-new-publi" type="text">
                                    <textarea className={themeReducer ? "publi-open-textarea input-dark border-none-dark" : "publi-open-textarea"} placeholder="What do you mean ?" name="text" id="text" onChange={e => handleChange(e)}></textarea>
                                </div>
                                <button className={themeReducer ? "publi-open-btn btn-dark" : "publi-open-btn"} type="submit">SEND</button>
                            </form>
                        </div>

                    </div>
                </animated.div>
            ))}
    </div>
    )
}
