import React from 'react'
import Video from "../Publication/Video"
import {useHistory} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"

export default function FullFile() {

    const fullFileReducer = useSelector(state => state.FullFile)
    const dispatch = useDispatch()
    const history = useHistory()

    const type = () => {  
        if (fullFileReducer.type === "image") return <img className="fullFile-img" src={fullFileReducer.publicationFileUrl} alt="frame"/>
        else if (fullFileReducer.type === "video") return <Video data={fullFileReducer} isTall={true} />    
    }

    const handleClickClose = () => {
        dispatch({
            type: "CLOSE_FULL_FILE"
        })
    }

    const handleClickUser = () => {
        dispatch({
            type: "CLOSE_FULL_FILE"
        })
        history.push(`/account/${fullFileReducer.userId}`)
    }

    return ( fullFileReducer !== 0 ?
        <div className="fullFile">
            <FontAwesomeIcon icon="times-circle" className="fullFile-close-icon" onClick={() => handleClickClose()} />
            <div className="fullFile-box">
                <div onClick={() => handleClickUser()} className="fullFile-user">
                    <div className="fullFile-user-img-box">
                        <img className="fullFile-user-img" src={fullFileReducer.userImageUrl}  alt="Profile frame"/>
                    </div>
                    <div className="fullFile-user-info">
                        <p>{fullFileReducer.firstName} {fullFileReducer.lastName}</p>
                    </div>
                </div>
                {type()}
            </div>
        </div>
    : null)
}
