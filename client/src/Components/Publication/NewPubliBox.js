import React from 'react'
import {useSelector} from "react-redux"
import "../../Styles/publication.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"

export default function NewPubliBox({ setPubli }) {

    const themeReducer = useSelector(state => state)

    const updatePubli = () => {
        setPubli(false)
    }

    return (
        <div className="new-publi-container">
            <div className="new-publi-opacity"></div>
            <div className={themeReducer.Theme ? "new-publi-content-dark" : "new-publi-content"}>
                <button className={themeReducer.Theme ? "new-publi-icon-btn-dark" : "new-publi-icon-btn"} onClick={updatePubli}><FontAwesomeIcon icon="times-circle" className="new-publi-close-icon"/></button>
                <form className="new-publi-form">          
                    <div className={themeReducer.Theme ? "new-publi-box-dark" : "new-publi-box"}>
                        <FontAwesomeIcon className={themeReducer.Theme ? "icon-new-publi-dark" : "icon-new-publi"} icon="comments" />
                        <textarea name="newPubli" className={themeReducer.Theme ? "new-publi-textarea textarea-dark" : "new-publi-textarea"} placeholder="What do you mean ?"></textarea>
                    </div>
                    <div className="bottom-new-publi">
                        <FontAwesomeIcon icon="image" className="icon-write-new-publi"/>
                        <p className="icon-write-new-publi">GIF</p>
                    </div>
                    <input className={themeReducer.Theme ? "new-publi-input input-dark" : "new-publi-input"} type="text" placeholder="#..."/>
                    <button className={themeReducer.Theme ? "new-publi-btn-dark" : "new-publi-btn"}>PUBLISH</button>
                </form>
            </div>
        </div>
    )
}
