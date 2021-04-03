import React, {useState, useEffect} from 'react'
import {useSelector} from "react-redux"
import {useHistory, useLocation, useParams} from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import PublicationCard from "./PublicationCard"
import moment from "moment"
import Loader from "../Services/Loader"
import axios from "axios"
import {socket} from "../../Api"

export default function PublicationComments() {

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
    const [dataComments, setDataComments] = useState([])
    const [dataNewPubli, setDataNewPubli] = useState({
        userId: userDataReducer.userId,
        text: ""
    })
    
    useEffect(() => {
        setLoad(false)
        const fetchData = async () => {
            if (location.state === undefined) {
                await axios.get(`http://localhost:3001/api/publications/one/${slug}`)
                    .then(res => {
                        setIsBack(false)
                        setData(res.data[0])
                    })
                    .catch(err => console.log(err))
            } else  {
                setIsBack(true)
                setData(location.state.data)
            }
            
            await axios.get(`http://localhost:3001/api/publications/comments/${slug}`)
            .then(res => {
                setDataComments(res.data)
            })
            .catch(err => console.log(err))
            setLoad(true)
        }
        fetchData()
    }, [location])

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

    const handleClickProfile = userId => {
        history.push(`/account/${userId}`)
    }

    const handleBack = () => {
        let path = location.state.path
        history.push(path)
    }

    return (load ?
        <div className={themeReducer ? "publi-open-dark" : "publi-open"}>
            <div className="publi-icon">
                {isBack ? <FontAwesomeIcon onClick={() => handleBack()} icon="arrow-left" className={themeReducer ? "txt-dark gallery-icon" : "gallery-icon"}/> : null}
            </div>
            <div className="publi-open-bottom-container">
                <div className="publi-open-top">
                    <PublicationCard data={data} noClick={true} />
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
