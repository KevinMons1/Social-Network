import React, {useState, useEffect} from 'react'
import {useSelector} from "react-redux"
import {Link} from "react-router-dom"
import "../../Styles/publication.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import moment from "moment"
import axios from 'axios'

export default function PublicationCard({open, data}) { 

    const themeReducer = useSelector(state => state.Theme)
    const userDataReducer = useSelector(state => state.UserData)
    const [hashtag, setHashtag] = useState("")
    const [deleteAlert, setDeleteAlert] = useState(false)
    const [deleteMsg, setDeleteMsg] = useState(true)

    useEffect(() => {
        // To separate a long string into several hashtags if there is a need
        if (data.hashtag.length > 0) {
            let _hashtag = data.hashtag
            _hashtag = _hashtag.replace(";", " #")
            _hashtag = "#" + _hashtag
            setHashtag(_hashtag)
        }
    }, [])

    const handleDelete = () => {
        if (data.userId === userDataReducer.userId) {
            axios.delete(`http://localhost:3001/api/publications/account/delete/${data.userId + "-" + data.publicationId}`)
                .then(res => {
                    if (res.data.alert) {
                        // setDeleteMsg(true)
                        setDeleteMsg(false)
                    }
                })
                .catch(err => console.log(err))
            }
    }

    const cssDelete = deleteMsg ? themeReducer ? "publi-dark" : "publi" : "publi-none"

    return (
        <div className={cssDelete}>
            {deleteAlert 
            ? <div className="deleteMsg-container">
                <div className="deleteMsg-opacity"></div>
                <div className={themeReducer ? "deleteMsg-box-dark" : "deleteMsg-box"}>
                    <p className={themeReducer ? "txt-dark" : null}>You are sure to delete this publication ?</p>
                    <div>
                        <button className="deleteMsg-btn delBtn1" onClick={() => handleDelete()}>DELETE</button>
                        <button className="deleteMsg-btn delBtn2" onClick={() => setDeleteAlert(false)}>CANCEL</button>
                    </div>
                </div>
              </div>
            : null
            }
            {data.userId === userDataReducer.userId
            ? <div className="publi-delete-box"> 
                <button className={themeReducer ? "publi-delete-btn-dark" : "publi-delete-btn"} onClick={() => setDeleteAlert(true)}>Delete</button>
              </div>
            : null}
            <div className="publi-top">  
                <div className="info-publi">
                    <div className="left-publi">
                        <div className="left-publi-img-box">
                            <Link to={`/account/${data.userId}`}>
                                <img className="left-publi-img" src={data.profileImageUrl} alt="Profile frame"/>
                            </Link>
                        </div>
                        <div className="left-publi-info">
                            <Link to={`/account/${data.userId}`} className={themeReducer ? 'txt-dark' : "left-publi-info-link"}>{data.firstName} {data.lastName}</Link>
                            <small className={themeReducer ? 'txt-dark' : null}>{moment(data.date).fromNow()}</small>
                        </div>
                    </div>
                    <div className="right-publi">
                        <p className={themeReducer ? 'txt-dark' : null}>{hashtag}</p>
                    </div>
                </div>

                <div className="text-publi">
                    <p className={themeReducer ? 'txt-dark' : null} onClick={() => open(data)}>{data.text}</p>
                </div>
            </div>
             
                {data.publicationImageUrl != null 
                ? <div className="bg-publi">
                    <img className="bg-publi-img" src={data.publicationImageUrl} onClick={() => open(data)} alt="Publication frame"/>
                  </div>
                : null}

                <div className="social-publi">
                    <div className="icon-publi">
                        <FontAwesomeIcon className="heart-publi" icon="heart" />
                        <p className={themeReducer ? 'txt-dark' : null}>{data.likesTotal}</p>
                    </div>
                    <div className="icon-publi">
                        <FontAwesomeIcon className="comment-publi" icon="comment" />
                        <p className={themeReducer ? 'txt-dark' : null}>{data.commentsTotal}</p>
                    </div>
                </div>
              
        </div>
    )
}
