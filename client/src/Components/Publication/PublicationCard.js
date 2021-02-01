import React, {useState, useEffect} from 'react'
import {useSelector} from "react-redux"
import "../../Styles/publication.css"
import Publication from "../../Assets/Images/publication1.jpg"
import ProfilDefault from "../../Assets/Images/profil_default.jpg"
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
        let _hashtag = data.hashtag

        _hashtag = _hashtag.replace(";", " #")
        _hashtag = "#" + _hashtag

        setHashtag(_hashtag)
    }, [])

    const handleDelete = () => {
        if (data.id_user == userDataReducer.id) {
            axios.delete(`http://localhost:3001/api/publications/account/delete/${data.id}`)
                .then(res => {
                    if (res.data.alert) {
                        setDeleteMsg(true)
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
            {data.id_user == userDataReducer.id
            ? <div className="publi-delete-box"> 
                <button className={themeReducer ? "publi-delete-btn-dark" : "publi-delete-btn"} onClick={() => setDeleteAlert(true)}>Delete</button>
              </div>
            : null}
            <div className="publi-top">  
                <div className="info-publi">
                    <div className="left-publi">
                        <div className="left-publi-img-box">
                            <img className="left-publi-img" src={ProfilDefault} alt="Frame profile"/>
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
                    <p className={themeReducer ? 'txt-dark' : null}>{data, data.text}</p>
                </div>
            </div>
             
                <div className="bg-publi" onClick={open}>
                    <img className="bg-publi-img" src={Publication} alt="Frame of publication"/>
                </div>

                <div className="social-publi">
                    <div className="icon-publi">
                        <FontAwesomeIcon className="heart-publi" icon="heart" />
                        <p className={themeReducer ? 'txt-dark' : null}>{data.like_total}</p>
                    </div>
                    <div className="icon-publi">
                        <FontAwesomeIcon className="comment-publi" icon="comment" />
                        <p className={themeReducer ? 'txt-dark' : null}>{data.comments_total}</p>
                    </div>
                </div>
              
        </div>
    )
}
