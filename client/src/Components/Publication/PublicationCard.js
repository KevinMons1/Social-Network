import React, {useState, useEffect} from 'react'
import {useSelector} from "react-redux"
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
        if (data.user_id === userDataReducer.user_id) {
            axios.delete(`http://localhost:3001/api/publications/account/delete/${data.user_id + "-" + data.publication_id}`)
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
            {data.user_id === userDataReducer.user_id
            ? <div className="publi-delete-box"> 
                <button className={themeReducer ? "publi-delete-btn-dark" : "publi-delete-btn"} onClick={() => setDeleteAlert(true)}>Delete</button>
              </div>
            : null}
            <div className="publi-top">  
                <div className="info-publi">
                    <div className="left-publi">
                        <div className="left-publi-img-box">
                            <img className="left-publi-img" src={data.profile_image_url} alt="Profile frame"/>
                        </div>
                        <div className="left-publi-info">
                            <p className={themeReducer ? 'txt-dark' : null}>{data.first_name} {data.last_name}</p>
                            <small className={themeReducer ? 'txt-dark' : null}>{moment(data.date).fromNow()}</small>
                        </div>
                    </div>
                    <div className="right-publi">
                        <p className={themeReducer ? 'txt-dark' : null}>{hashtag}</p>
                    </div>
                </div>

                <div className="text-publi">
                    <p className={themeReducer ? 'txt-dark' : null}>{data.text}</p>
                </div>
            </div>
             
                <div className="bg-publi" onClick={() => open(data)}>
                    <img className="bg-publi-img" src={data.publication_image_url} alt="Publication frame"/>
                </div>

                <div className="social-publi">
                    <div className="icon-publi">
                        <FontAwesomeIcon className="heart-publi" icon="heart" />
                        <p className={themeReducer ? 'txt-dark' : null}>{data.likes_total}</p>
                    </div>
                    <div className="icon-publi">
                        <FontAwesomeIcon className="comment-publi" icon="comment" />
                        <p className={themeReducer ? 'txt-dark' : null}>{data.comments_total}</p>
                    </div>
                </div>
              
        </div>
    )
}
