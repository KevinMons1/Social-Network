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
                <div className={themeReducer ? "account-bg-loader account-loader-dark" : "account-bg-loader"}></div>
                <div className="account-info">
                    <div className="account-info-top">
                        <div className={themeReducer ? "account-info-img-loader account-info-img-loader-dark" : "account-info-img-loader"}>
                        </div>
                        <div>
                            <p className={themeReducer ? "account-name-loader account-loader-dark" : "account-name-loader"}></p>
                        </div>

                    </div>
                    <div className="account-bottom">
                        <div className="account-icon">
                            <div className="account-icon-box">
                                <FontAwesomeIcon icon="heart" className="icon-loader"/>
                            </div>
                            <div className="account-icon-box">
                                <FontAwesomeIcon icon="user-friends" className="icon-loader"/>
                            </div>
                            <div className="account-icon-box">
                                <FontAwesomeIcon icon="pen" className="icon-loader"/>
                            </div>
                        </div>
                        <div className="account-bio">
                        <p className={themeReducer ? "text-loader1 account-loader-dark" : "text-loader1"}></p><br/>
                        <p className={themeReducer ? "text-loader2 account-loader-dark" : "text-loader2"}></p><br/>
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
