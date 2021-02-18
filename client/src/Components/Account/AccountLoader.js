import React from 'react'
import {useSelector} from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import PublicationCardLoader from "../Publication/PublicationCardLoader"

export default function AccountLoader() {

    const themeReducer = useSelector(state => state.Theme)

    return (
        <div className="account-content">
            <div className={themeReducer ? "account-top-dark" : "account-top"}>
                <div className="account-bg-loader"></div>
                <div className="account-info">
                    <div className="account-info-top">
                        <div className={themeReducer ? "account-info-img-dark-loader" : "account-info-img-loader"}>
                        </div>
                        <div>
                            <p className="account-name-loader"></p>
                        </div>

                    </div>
                    <div className="account-bottom">
                        <div className="account-icon">
                            <div className="account-icon-box">
                                <FontAwesomeIcon icon="heart" className="icon-loader"/>
                                <p className="icon-txt-loader"></p>
                            </div>
                            <div className="account-icon-box">
                                <FontAwesomeIcon icon="user-friends" className="icon-loader"/>
                                <p className="icon-txt-loader"></p>
                            </div>
                            <div className="account-icon-box">
                                <FontAwesomeIcon icon="pen" className="icon-loader"/>
                                <p className="icon-text-loader"></p>
                            </div>
                        </div>
                        <div className="account-bio">
                        <p className="text-loader1"></p><br/>
                        <p className="text-loader2"></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="box-publi">
                <PublicationCardLoader />
                <PublicationCardLoader />
                <PublicationCardLoader />
            </div>
        </div>
    )
}
