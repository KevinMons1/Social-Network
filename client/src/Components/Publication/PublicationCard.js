import React from 'react'
import {useSelector} from "react-redux"
import "../../Styles/publication.css"
import Publication from "../../Assets/Images/publication1.jpg"
import ProfilDefault from "../../Assets/Images/profil_publication1.jpg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"

export default function PublicationCard(props) { 

    const themeReducer = useSelector(state => state)

    return (
        <div className={themeReducer.Theme ? "publi-dark" : "publi"}>

            <div className="publi-top">  
                <div className="info-publi">
                    <div className="left-publi">
                        <div className="left-publi-img-box">
                            <img className="left-publi-img" src={ProfilDefault} alt="Frame profile"/>
                        </div>
                        <div className="left-publi-info">
                            <p className={themeReducer.Theme ? 'txt-dark' : null}>Tom Mohy</p>
                            <small className={themeReducer.Theme ? 'txt-dark' : null}>3 hours ago</small>
                        </div>
                    </div>
                    <div className="right-publi">
                        <p className={themeReducer.Theme ? 'txt-dark' : null}>#Christmas</p>
                        <p className={themeReducer.Theme ? 'txt-dark' : null}>#Fir</p>
                        <p className={themeReducer.Theme ? 'txt-dark' : null}>#Happy</p>
                    </div>
                </div>

                <div className="text-publi">
                    <p className={themeReducer.Theme ? 'txt-dark' : null}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Temporibus hic eligendi quidem corrupti impedit accusantium?</p>
                </div>
            </div>
             
                <div className="bg-publi" onClick={props.open}>
                    <img className="bg-publi-img" src={Publication} alt="Frame of publication"/>
                </div>

                <div className="social-publi">
                    <div className="icon-publi">
                        <FontAwesomeIcon className="heart-publi" icon="heart" />
                        <p className={themeReducer.Theme ? 'txt-dark' : null}>36</p>
                    </div>
                    <div className="icon-publi">
                        <FontAwesomeIcon className="comment-publi" icon="comment" />
                        <p className={themeReducer.Theme ? 'txt-dark' : null}>6</p>
                    </div>
                </div>
              
        </div>
    )
}
