import React, {useState, useEffect} from 'react'
import "../../Styles/account.css"
import "../../Styles/Media-Queries/Tablet/account.css"
import "../../Styles/Media-Queries/MobileL/account.css"
import "../../Styles/Media-Queries/MobileS/account.css"
import {useSelector, useDispatch} from "react-redux"
import {useParams, useLocation, useHistory, Link} from "react-router-dom"
import axios from "axios"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import {socket} from "../../Api"
import NewPubliBox from '../Publication/NewPubliBox'
import PublicationCard from '../Publication/PublicationCard'
import ModifyAccount from "./ModifyAccount"
import AccountLoader from "./AccountLoader"
import RemoveFriend from "./RemoveFriend"

export default function MainAccount({ changeTitle }) {
    
    const location = useLocation()
    const history = useHistory()
    const {slug} = useParams()
    const dispatch = useDispatch()
    const userDataReducer = useSelector(state => state.UserData)
    const themeReducer = useSelector(state => state.Theme)
    const [load, setLoad] = useState(false)
    const [openNewPubli, setOpenNewPubli] = useState(false)
    const [openModifyAccount, setOpenModifyAccount] = useState(false)
    const [openRemoveFriend, setOpenRemoveFriend] = useState(false)
    const [dataUser, setDataUser] = useState(null)
    const [dataPublications, setDataPublications] = useState(null)
    const [isEmpty, setIsEmpty] = useState(true)
    const [isFriend, setIsFriend] = useState(false)
    const [waiting, setWaiting] = useState(false)

    useEffect(() => {
        // Get informations for account
        setLoad(false)
        const id = slug

        dispatch({
            type: "CHANGE_ZINDEX",
            payload: false
          })

        const fetchDataAccount = async () => {
            let stop = false
            await axios.get(`${process.env.REACT_APP_URL}api/user/account/informations/${id}`)
                .then(res => {
                    if (res.data.alert) {
                        stop = true
                        return history.push({pathname: '/error404'})
                    } else {
                        changeTitle(`${res.data.userData[0].firstName} ${res.data.userData[0].lastName}`)
                        setDataUser(res.data.userData)
                    }
                })
                .catch(err => console.log(err))

            if (stop) return
            
            await axios.get(`${process.env.REACT_APP_URL}api/publications/account/${id}`)
            .then(res => {
                if (res.data.length === 0) {
                    setIsEmpty(true)
                } else {
                    setDataPublications(res.data)
                    setIsEmpty(false)
                }
            })
            .catch(err => console.log(err))
            
            await axios.post(`${process.env.REACT_APP_URL}api/user/account/isFriend/${id}`, {userId: userDataReducer.userId})
                .then(res => {
                    setIsFriend(res.data)
                })
                .catch(err => console.log(err))
            setLoad(true)
        }
        fetchDataAccount()
    }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleOpenModifyAccount = () => {
        setOpenModifyAccount(!openModifyAccount)
    }

    const handleDeleteFriend = (choice) => {
        setOpenRemoveFriend(false)
        setIsFriend(choice)
    }

    const handleAddFriend = () => {     
        let today = new Date()
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
        let dateTime = date+' '+time
        
        setWaiting(true)
        axios.post(`${process.env.REACT_APP_URL}api/notifications/add`, {
            receiver : slug,
            sender: userDataReducer.userId,
            type: "invitation",
            date: dateTime
        })
        socket.emit("notification", {
            receiver: slug,
            sender: {
                user: {
                    firstName: userDataReducer.firstName,
                    lastName: userDataReducer.lastName,
                    profileImage: userDataReducer.profileImage,
                    userId: userDataReducer.userId
                },
                content: {
                    receiverId: slug,
                    senderId: userDataReducer.userId,
                    type: "invitation",
                    date: dateTime,
                    view: 0,
                }
            }
        })
    }

    return (
        <div className={themeReducer ? "mainAccount-dark" : "mainAccount"}>
            {load ?
                <div className="account-container">
                    {openNewPubli ? <NewPubliBox setPubli={setOpenNewPubli} /> : null}
                    {openModifyAccount ? <ModifyAccount slug={slug} setClose={setOpenModifyAccount} /> : null}
                    {openRemoveFriend ? <RemoveFriend slug={slug} friendId={dataUser[0].userId} setClose={(choice) => handleDeleteFriend(choice)} /> : null}

                    <div className={themeReducer ? "account-top-dark" : "account-top"}>
                        <div className="account-bg">
                            <img className="account-bg-img" src={dataUser[0].bannerImage} alt="Your banner frame"/>
                        </div>
                        <div className="account-info">
                            <div className="account-info-top">
                                <div className={themeReducer ? "account-info-img-dark" : "account-info-img"}>
                                    <img className="img-profile" src={dataUser[0].profileImage} alt="Your profile frame"/>
                                </div>
                                <div>
                                    <p className={themeReducer ? "txt-dark" : null}>{dataUser[0].firstName} {dataUser[0].lastName}</p>
                                </div>

                            {parseInt(slug) !== userDataReducer.userId
                            ?  isFriend
                                ?   <div className="account-action">
                                        <p className={themeReducer ? "txt-dark" : null} onClick={() => setOpenRemoveFriend(true)}>Friend</p>
                                        <FontAwesomeIcon icon="user-friends" className={themeReducer ? "txt-dark" : "account-icon action-icon"}/>
                                    </div>
                                :  waiting 
                                    ?   <div className="account-action">
                                            <p className={themeReducer ? "txt-dark" : null}>Waiting...</p>
                                        </div>
                                    :  <div className="account-action">
                                            <p className={themeReducer ? "txt-dark" : null} onClick={() => handleAddFriend()}>Add friend</p>
                                            <FontAwesomeIcon icon="user-plus" className={themeReducer ? "txt-dark" : "account-icon action-icon"}/>
                                        </div>
                            :   <div className="account-action">
                                    <p className={themeReducer ? "txt-dark" : null} onClick={() => handleOpenModifyAccount()}>Modify my account</p>
                                    <FontAwesomeIcon icon="edit" className={themeReducer ? "txt-dark" : "account-icon action-icon"}/>
                                </div>
                            }

                            </div>
                            <div className="account-bottom">
                                <div className="account-icon">
                                    <div className="account-icon-box">
                                        <FontAwesomeIcon icon="heart" className="heart-icon account-bottom-icon"/>
                                        <p className={themeReducer ? "account-icon-nbr-dark" : "account-icon-nbr"}>{dataUser[1].likesTotal}</p>
                                    </div>
                                    <div className="account-icon-box">
                                        <FontAwesomeIcon icon="user-friends" className="user-friends-icon account-bottom-icon"/>
                                        <p className={themeReducer ? "account-icon-nbr-dark" : "account-icon-nbr"}>{dataUser[1].friendsTotal}</p>
                                    </div>
                                    <div className="account-icon-box">
                                        <FontAwesomeIcon icon="pen" className="pen-icon account-bottom-icon"/>
                                        <p className={themeReducer ? "account-icon-nbr-dark" : "account-icon-nbr"}>{dataUser[1].publicationsTotal}</p>
                                    </div>
                                </div>
                                <div className="account-bio">
                                    <p className={themeReducer ? "txt-dark" : null}>{dataUser[0].bio}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={themeReducer ? "account-links-dark" : "account-links"}>
                        <div className="account-box">
                            <FontAwesomeIcon className="account-links-icon" icon="camera" />
                            <Link to={{pathname: `/account/${slug}/gallery`}} className={themeReducer ? "txt-dark account-links-link" : "account-links-link"}>Gallery</Link>
                        </div>
                        <div className="account-box">
                            <FontAwesomeIcon className="account-links-icon" icon="user-friends" />
                            <Link to={`/account/${slug}/friends`} className={themeReducer ? "txt-dark account-links-link" : "account-links-link"}>Friends</Link>
                        </div>
                    </div>

                    <div className="account-publi">
                        {parseInt(slug) !== userDataReducer.userId
                        ? null
                        :   <div className="new-publi">
                                <div className="write-publi" onClick={() => setOpenNewPubli(true)}>
                                    <FontAwesomeIcon className={themeReducer ? "icon-new-publi txt-dark" : "icon-new-publi"} icon="comments" />
                                    <div className="input-new-publi" type="text">
                                        <p className={themeReducer ? "write-publi-placeholder txt-dark" : "write-publi-placeholder"}>What do you mean ?</p>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>

                    {isEmpty
                    ?   <div className="account-empty">
                            <p className={themeReducer ? "txt-dark" : null}>This account seems very empty to me ...</p>
                        </div>
                    : dataPublications.map((item, index) => {
                        return (
                            <div key={index} className="box-publi">
                                <PublicationCard data={item} />
                            </div>
                        )
                    })
                    }
                </div>
            : <AccountLoader />}
        </div>
    )
}