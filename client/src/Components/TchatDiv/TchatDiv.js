import React, {useEffect} from 'react'
import {useSelector, useDispatch} from "react-redux"
import "../../Styles/tchat.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import UserCard from '../Connected/UserCard'

export default function TchatDiv({choiceCss, closeTchat}) {

    const themeReducer = useSelector(state => state.Theme)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch({
            type: "CHANGE_ZINDEX",
            payload: true
          })
    }, [])

    const choiceContainer = choiceCss ? "tchatDiv-container-mini" : "tchatDiv-container"
    const choiceInfo = choiceCss ? "tchatDiv-info-mini" : "tchatDiv-info"

    return (
        <div className={themeReducer ? `${choiceContainer} tchatDiv-dark` : choiceContainer}>
            <div className="tchatDiv-top">
                <div className="tchatDiv-icon">
                    {choiceCss ? <FontAwesomeIcon icon="times-circle" className="close-icon" onClick={closeTchat} /> : null}
                </div>
                <div className={themeReducer ? `${choiceInfo} tchatDiv-info-dark` : choiceInfo}>
                    <UserCard />
                </div>
            </div>            
            <div className={choiceCss ? "tchatDiv-mini" : "tchatDiv"}>
                <div className="msg-container">
                    <div className="msg-box">
                        <div className="msg">
                            <p className="msg-txt">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae eos inventore dolores eaque fugiat.</p>
                        </div>
                    </div>

                    <div className="msg-box">
                        <div className="msg">
                            <p className="msg-txt">eaque fugiat.</p>
                        </div>
                    </div>

                    <div className="msg-box msg-right-box">
                        <div className="msg msg-right">
                            <p className="msg-txt">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae eos inventore dolores eaque fugiat.</p>
                        </div>
                    </div>
                    
                    <div className="msg-box">
                        <div className="msg">
                            <p className="msg-txt">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae eos inventore dolores eaque fugiat.</p>
                        </div>
                    </div>

                    <div className="msg-box">
                        <div className="msg">
                            <p className="msg-txt">eaque fugiat.</p>
                        </div>
                    </div>

                    <div className="msg-box msg-right-box">
                        <div className="msg msg-right">
                            <p className="msg-txt">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae eos inventore dolores eaque fugiat.</p>
                        </div>
                    </div>

                    <div className="msg-box">
                        <div className="msg">
                            <p className="msg-txt">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae eos inventore dolores eaque fugiat.</p>
                        </div>
                    </div>

                    <div className="msg-box">
                        <div className="msg">
                            <p className="msg-txt">eaque fugiat.</p>
                        </div>
                    </div>

                    <div className="msg-box msg-right-box">
                        <div className="msg msg-right">
                            <p className="msg-txt">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae eos inventore dolores eaque fugiat.</p>
                        </div>
                    </div>
                    
                    <div className="msg-box">
                        <div className="msg">
                            <p className="msg-txt">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae eos inventore dolores eaque fugiat.</p>
                        </div>
                    </div>

                    <div className="msg-box">
                        <div className="msg">
                            <p className="msg-txt">eaque fugiat.</p>
                        </div>
                    </div>

                    <div className="msg-box msg-right-box">
                        <div className="msg msg-right">
                            <p className="msg-txt">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae eos inventore dolores eaque fugiat.</p>
                        </div>
                    </div>

                    <div className="msg-box">
                        <div className="msg">
                            <p className="msg-txt">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae eos inventore dolores eaque fugiat.</p>
                        </div>
                    </div>

                    <div className="msg-box">
                        <div className="msg">
                            <p className="msg-txt">eaque fugiat.</p>
                        </div>
                    </div>

                    <div className="msg-box msg-right-box">
                        <div className="msg msg-right">
                            <p className="msg-txt">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae eos inventore dolores eaque fugiat.</p>
                        </div>
                    </div>
                    
                    <div className="msg-box">
                        <div className="msg">
                            <p className="msg-txt">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae eos inventore dolores eaque fugiat.</p>
                        </div>
                    </div>

                    <div className="msg-box">
                        <div className="msg">
                            <p className="msg-txt">eaque fugiat.</p>
                        </div>
                    </div>

                    <div className="msg-box msg-right-box">
                        <div className="msg msg-right">
                            <p className="msg-txt">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae eos inventore dolores eaque fugiat.</p>
                        </div>
                    </div>
                    
                </div>
            </div>
            <div className="tchat-write">
                <div className="write-box">
                    <div className="icon-new-msg">
                        <FontAwesomeIcon icon="image" className="icon-write-new-msg"/>
                        <p className="icon-write-new-msg">GIF</p>
                    </div>
                    <div className="new-msg-box">
                        <FontAwesomeIcon className="icon-send-msg" icon="paper-plane" />
                        <textarea name="newMsg" className="new-msg-textarea"></textarea>
                    </div>
                </div>
            </div>
        </div>
    )
}
