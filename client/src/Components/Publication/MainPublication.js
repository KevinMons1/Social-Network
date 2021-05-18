import React, {useState, useEffect} from 'react'
import "../../Styles/publication.css"
import "../../Styles/Media-Queries/Tablet/publication.css"
import {useSelector} from "react-redux"
import {useHistory, useLocation, useParams} from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import PublicationCard from "./PublicationCard"
import moment from "moment"
import Loader from "../Services/Loader"
import axios from "axios"
import {socket} from "../../Api"

export default function MainPublication() {

    const themeReducer = useSelector(state => state.Theme)
    const userDataReducer = useSelector(state => state.UserData)
    const location = useLocation()
    const history = useHistory()
    const { slug } = useParams()
    const [isBack, setIsBack] = useState(false)
    const [data, setData] = useState(null)
    const [load, setLoad] = useState(false)
    const [alertMsg, setAlertMsg] = useState("")
    const [alertCss, setAletCss] = useState(true)
    const [isLeft, setIsLeft] = useState(false)
    const [isRight, setIsRight] = useState(false)
    const [dataComments, setDataComments] = useState([])
    const [dataNewPubli, setDataNewPubli] = useState({
        userId: userDataReducer.userId,
        text: ""
    })
    
    useEffect(() => {
        setLoad(false)
        const fetchData = async () => {
            if (typeof location.state === undefined || location.state === false) {
                await axios.get(`${process.env.REACT_APP_URL}api/publications/one/${slug}`)
                    .then(res => {
                        setIsBack(false)
                        setData(res.data[0])
                    })
                    .catch(err => console.log(err))
            } else  {
                // Hide arrow left and arrow right
                if (location.state.isGallery) {
                    const { dataGallery, dataGalleryIndex } = location.state
                    if (dataGalleryIndex === 0) setIsLeft(false)
                    else setIsLeft(true)
                    if (dataGalleryIndex === dataGallery.length - 1) setIsRight(false)
                    else setIsRight(true)                  
                }
                else {
                    setIsLeft(false)
                    setIsRight(false)
                }
                setIsBack(true)
                setData(location.state.data)
            }
            
            await axios.get(`${process.env.REACT_APP_URL}api/publications/comments/${slug}`)
            .then(res => {
                setDataComments(res.data)
            })
            .catch(err => console.log(err))
            setLoad(true)
        }
        fetchData()
    }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = e => {
        e.preventDefault()

        let today = new Date();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateTime = date+' '+time;

        if (dataNewPubli.text.length > 2) {
            axios.post(`${process.env.REACT_APP_URL}api/publications/comments/add/${data.publicationId}`, dataNewPubli)
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
                    axios.post(`${process.env.REACT_APP_URL}api/notifications/add`, {
                        receiver : data.userId,
                        sender: userDataReducer.userId,
                        date: dateTime,
                        type: "comment"
                    })
                    socket.emit("notification", {
                        receiver: data.userId,
                        sender: {
                            user: {
                                firstName: userDataReducer.firstName,
                                lastName: userDataReducer.lastName,
                                profileImage: userDataReducer.profileImage,
                                userId: userDataReducer.userId
                            },
                            content: {
                                receiverId: data.userId,
                                senderId: userDataReducer.userId,
                                type: "comment",
                                date: dateTime,
                                view: 0,
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

    const handleClickProfile = userId => {
        history.push(`/account/${userId}`)
    }

    const handleBack = () => {
        let path = location.state.path
        history.push(path, true)
    }

    const handleNext = direction => {
        if (typeof location.state.isGallery !== undefined) {       
            const { dataGallery, dataGalleryIndex } = location.state
            const pathGallery = location.state.path
            let newIndex
            let newPublication
            
            if (direction === "left" && isLeft) {
                newIndex = dataGalleryIndex - 1
                newPublication = dataGallery[newIndex]
    
                history.push(`/publication/${newPublication.publicationId}`, {
                    data: newPublication,
                    path: pathGallery,
                    isGallery: true,
                    dataGallery,
                    dataGalleryIndex: newIndex
                })
            } else if (direction === "right" && isRight) {
                newIndex = dataGalleryIndex + 1
                newPublication = dataGallery[newIndex]
    
                history.push(`/publication/${newPublication.publicationId}`, {
                    data: newPublication,
                    path: pathGallery,
                    isGallery: true,
                    dataGallery,
                    dataGalleryIndex: newIndex
                })
            }
        }
    }

    window.onkeydown = e => {
        if (e.repeat) return

        if (e.key === "ArrowLeft") handleNext("left")
        else if (e.key === "ArrowRight") handleNext("right")
    }

    return (load ?
        <div className={themeReducer ? "publi-open-dark" : "publi-open"}>
            <div className="publi-icon">
                {isBack ? <FontAwesomeIcon onClick={() => handleBack()} icon="arrow-left" className={themeReducer ? "txt-dark gallery-icon" : "gallery-icon"}/> : null}
            </div>
            <div className="publi-open-bottom-container">
                <div className="publi-open-top">
                    {isLeft ? <FontAwesomeIcon onClick={() => handleNext("left")} icon="chevron-left" className={themeReducer ? "txt-dark gallery-chevron-icon gallery-chevron-icon-left" : "gallery-chevron-icon gallery-chevron-icon-left"}/> : null}
                    <PublicationCard data={data} fullFile={true} />
                    {isRight ? <FontAwesomeIcon onClick={() => handleNext("right")} icon="chevron-right" className={themeReducer ? "txt-dark gallery-chevron-icon gallery-chevron-icon-right" : "gallery-chevron-icon gallery-chevron-icon-right"}/> : null}
                </div>

                {dataComments.map((item, index) => {
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
                })} 

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
    </div>
    : <Loader />)
}
