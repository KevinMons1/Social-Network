import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import {useSelector} from "react-redux"

export default function PublicationCardLoader() {
    const themeReducer = useSelector(state => state.Theme)

    return (
        <div className={themeReducer ? "publi publi-dark" : "publi"}>
            <div className="publi-top">  
                <div className="info-publi">
                    <div className="left-publi">
                        <div className={themeReducer ? "left-publi-img-box-loader publi-loader-dark" : "left-publi-img-box-loader"}></div>
                        <div className="left-publi-info-loader"></div>
                    </div>
                    <div className="right-publi">
                        <p className={themeReducer ? "hashtag-loader publi-loader-dark" : "hashtag-loader"}></p>
                    </div>
                </div>

                <div className="text-publi">
                    <p className={themeReducer ? "text-loader1 publi-loader-dark" : "text-loader1"}></p><br/>
                    <p className={themeReducer ? "text-loader2 publi-loader-dark" : "text-loader2"}></p>
                </div>
            </div>
            
            <div className={themeReducer ? "bg-publi-loader publi-loader-dark" : "bg-publi-loader"}></div>

            <div className="social-publi">
                <div className="icon-publi-loader">
                    <FontAwesomeIcon className="icon-loader" icon="heart" />
                </div>
                <div className="icon-publi">
                    <FontAwesomeIcon className="icon-loader" icon="comment" />
                </div>
            </div>
    </div>
    )
}
