import React, {useState, useEffect} from 'react'
import "../../Styles/account.css"
import {useSelector, useDispatch} from "react-redux"
import {useParams, useLocation, useHistory, Link} from "react-router-dom"
import axios from "axios"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import NewPubliBox from '../Publication/NewPubliBox'
import PublicationCard from '../Publication/PublicationCard'
import PublicationComments from '../Publication/PublicationComments'
import ModifyAccount from "./ModifyAccount"
import AccountLoader from "./AccountLoader"
import RemoveFriend from "./RemoveFriend"

export default function MainAccount() {
    
    const location = useLocation()
    const history = useHistory()
    const {slug} = useParams()
    const dispatch = useDispatch()
    const userDataReducer = useSelector(state => state.UserData)
    const themeReducer = useSelector(state => state.Theme)
    const [load, setLoad] = useState(false)
    const [openNewPubli, setOpenNewPubli] = useState(false)
    const [openCommentsPubli, setOpenCommentsPubli] = useState(false)
    const [openModifyAccount, setOpenModifyAccount] = useState(false)
    const [openRemoveFriend, setOpenRemoveFriend] = useState(false)
    const [dataUser, setDataUser] = useState(null)
    const [dataPublications, setDataPublications] = useState(null)
    const [dataPubliClick, setDataPubliClick] = useState(null)
    const [isEmpty, setIsEmpty] = useState(true)
    const [isFriend, setIsFriend] = useState(false)

    useEffect(() => {
        // Get informations for account
        setLoad(false)
        const id = slug

        dispatch({
            type: "CHANGE_ZINDEX",
            payload: false
          })

        const fetchDataAccount = async () => {
            await axios.get(`http://localhost:3001/api/user/account/informations/${id}`)
                .then(res => {
                    if (res.data.alert) {
                        return history.push({pathname: '/error404'})
                    } else {
                        setDataUser(res.data.userData)
                    }
                })
                .catch(err => console.log(err))
                
                await axios.get(`http://localhost:3001/api/publications/account/${id}`)
                .then(res => {
                    if (res.data.length === 0) {
                        setIsEmpty(true)
                    } else {
                        setDataPublications(res.data)
                        setIsEmpty(false)
                    }
                })
                .catch(err => console.log(err))
            
            await axios.post(`http://localhost:3001/api/user/account/isFriend/${id}`, {userId: userDataReducer.userId})
                .then(res => {
                    setIsFriend(res.data)
                })
                .catch(err => console.log(err))
            setLoad(true)
        }
        fetchDataAccount()
    }, [location])

    const handleCloseCommentsPubli = () => {
        setOpenCommentsPubli(false)
    }

    const handleOpenCommentsPubli = (dataPubli) => {
        setDataPubliClick(dataPubli)
        setOpenCommentsPubli(!openCommentsPubli)
    }

    const handleOpenModifyAccount = () => {
        setOpenModifyAccount(!openModifyAccount)
    }

    const handleDeleteFriend = () => {
        setOpenRemoveFriend(false)
        setIsFriend(false)
    }

    const handleAddFriend = () => {
        axios.post(`http://localhost:3001/api/user/account/friend/add/${dataUser[0].userId}`, {userId: userDataReducer.userId})
            .then(res => {
                setIsFriend(true)
            })
            .catch(err => console.log(err))
    }

    return (
        <div className={themeReducer ? "mainAccount-dark" : "mainAccount"}>
            {load ?
                <div className="account-container">
                    {openCommentsPubli ? <PublicationComments close={handleCloseCommentsPubli} data={dataPubliClick} /> : null}               
                    {openNewPubli ? <NewPubliBox /*publi={openNewPubli}*/ setPubli={setOpenNewPubli} />  : null}
                    {openModifyAccount ? <ModifyAccount slug={slug} setClose={setOpenModifyAccount} /> : null}
                    {openRemoveFriend ? <RemoveFriend slug={slug} friendId={dataUser[0].userId} setClose={handleDeleteFriend} /> : null}

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
                                        <FontAwesomeIcon icon="user-friends" className={themeReducer ? "txt-dark" : "edit-icon"}/>
                                    </div>
                                :   <div className="account-action">
                                        <p className={themeReducer ? "txt-dark" : null} onClick={() => handleAddFriend()}>Add friend</p>
                                        <FontAwesomeIcon icon="user-plus" className={themeReducer ? "txt-dark" : "edit-icon"}/>
                                    </div>
                            :   <div className="account-action">
                                    <p className={themeReducer ? "txt-dark" : null} onClick={() => handleOpenModifyAccount()}>Modify my account</p>
                                    <FontAwesomeIcon icon="edit" className={themeReducer ? "txt-dark" : "edit-icon"}/>
                                </div>
                            }

                            </div>
                            <div className="account-bottom">
                                <div className="account-icon">
                                    <div className="account-icon-box">
                                        <FontAwesomeIcon icon="heart" className="heart-icon"/>
                                        <p className={themeReducer ? "account-icon-nbr-dark" : "account-icon-nbr"}>{dataUser[1].likesTotal}</p>
                                    </div>
                                    <div className="account-icon-box">
                                        <FontAwesomeIcon icon="user-friends" className="user-friends-icon"/>
                                        <p className={themeReducer ? "account-icon-nbr-dark" : "account-icon-nbr"}>{dataUser[1].friendsTotal}</p>
                                    </div>
                                    <div className="account-icon-box">
                                        <FontAwesomeIcon icon="pen" className="pen-icon"/>
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
                        <div className="account-box">
                            <FontAwesomeIcon className="account-links-icon" icon="address-card" />
                            <Link to={`/account/${slug}/about`} className={themeReducer ? "txt-dark account-links-link" : "account-links-link"}>About</Link>
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
                                <PublicationCard open={handleOpenCommentsPubli} data={item} />
                            </div>
                        )
                    })
                    }
                </div>
            : <AccountLoader />}
        </div>
    )
}