import React from 'react'
import {useSelector} from "react-redux"
import "../../Styles/publication.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import ProfilDefault from "../../Assets/Images/profil_publication1.jpg"
import PublicationCard from "./PublicationCard"

export default function PublicationComments({close, data}) {

    const themeReducer = useSelector(state => state.Theme)

    return (
        <div className="publi-open">
            <div className="publi-icon">
                <FontAwesomeIcon icon="times-circle" className="publi-icon-close" onClick={close} />
            </div>
            <div className="publi-open-bottom-container">
                <div className="publi-open-top">
                    <PublicationCard data={data} />
                </div>

                <div className="publi-open-bottom">
                    <div className="publi-open-name">
                        <p className={themeReducer ? 'txt-dark' : null}>Tom Mohy</p>
                    </div>
                    <div className="publi-open-info">
                        <div className="publi-open-img">
                            <img src={ProfilDefault} alt="Frame profile"/>
                        </div>
                        <p className={themeReducer ? "publi-open-txt txt-dark" : "publi-open-txt"}>Lorem ipsum Eos dolore debitis assumenda aspernatur commodi. Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                    </div>
                </div>

                <div className="publi-open-bottom">
                    <div className="publi-open-name">
                        <p className={themeReducer ? 'txt-dark' : null}>Tom Mohy</p>
                    </div>
                    <div className="publi-open-info">
                        <div className="publi-open-img">
                            <img src={ProfilDefault} alt="Frame profile"/>
                        </div>
                        <p className={themeReducer ? "publi-open-txt txt-dark" : "publi-open-txt"}>Lorem ipsum Eos dolore debitis assumenda aspernatur commodi. Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                    </div>
                </div>

                <div className="publi-open-bottom">
                    <div className="publi-open-name">
                        <p className={themeReducer ? 'txt-dark' : null}>Tom Mohy</p>
                    </div>
                    <div className="publi-open-info">
                        <div className="publi-open-img">
                            <img src={ProfilDefault} alt="Frame profile"/>
                        </div>
                        <p className={themeReducer ? "publi-open-txt txt-dark" : "publi-open-txt"}>Lorem ipsum Eos dolore debitis assumenda aspernatur commodi. Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                    </div>
                </div>

                <div className="publi-open-bottom">
                    <div className="publi-open-name">
                        <p className={themeReducer ? 'txt-dark' : null}>Tom Mohy</p>
                    </div>
                    <div className="publi-open-info">
                        <div className="publi-open-img">
                            <img src={ProfilDefault} alt="Frame profile"/>
                        </div>
                        <p className={themeReducer ? "publi-open-txt txt-dark" : "publi-open-txt"}>Lorem ipsum Eos dolore debitis assumenda aspernatur commodi. Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                    </div>
                </div>

                <div className="publi-open-bottom">
                    <div className="publi-open-name">
                        <p className={themeReducer ? 'txt-dark' : null}>Tom Mohy</p>
                    </div>
                    <div className="publi-open-info">
                        <div className="publi-open-img">
                            <img src={ProfilDefault} alt="Frame profile"/>
                        </div>
                        <p className={themeReducer ? "publi-open-txt txt-dark" : "publi-open-txt"}>Lorem ipsum Eos dolore debitis assumenda aspernatur commodi. Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                    </div>
                </div>

                <div className="new-publi">
                    <form className="write-publi">
                        <FontAwesomeIcon className={themeReducer ? "icon-new-publi txt-dark" : "icon-new-publi"} icon="comments" />
                        <div className="input-new-publi" type="text">
                            <textarea className={themeReducer ? "publi-open-textarea input-dark border-none-dark" : "publi-open-textarea"} placeholder="What do you mean ?"></textarea>
                        </div>
                        <button className={themeReducer ? "publi-open-btn btn-dark" : "publi-open-btn"}>SEND</button>
                    </form>
                </div>

            </div>
        </div>
    )
}
