import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"

export default function PublicationCardLoader() {

    return (
        <div className="publi">
            <div className="publi-top">  
                <div className="info-publi">
                    <div className="left-publi">
                        <div className="left-publi-img-box-loader"></div>
                        <div className="left-publi-info-loader"></div>
                    </div>
                    <div className="right-publi">
                        <p className="hashtag-loader"></p>
                    </div>
                </div>

                <div className="text-publi">
                    <p className="text-loader1"></p><br/>
                    <p className="text-loader2"></p>
                </div>
            </div>
            
            <div className="bg-publi-loader"></div>

            <div className="social-publi">
                <div className="icon-publi">
                    <FontAwesomeIcon className="icon-loader" icon="heart" />
                </div>
                <div className="icon-publi">
                    <FontAwesomeIcon className="icon-loader" icon="comment" />
            </div>
        </div>
    </div>
    )
}
