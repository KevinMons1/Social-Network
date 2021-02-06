import React, {useState, useEffect} from 'react'
import "../../Styles/account.css"
import {useSelector} from "react-redux"
import {useParams, useHistory} from "react-router-dom"
import axios from "axios"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import Loader from "../Services/Loader"
import NewPubliBox from '../Publication/NewPubliBox'
import PublicationCard from '../Publication/PublicationCard'
import PublicationComments from '../Publication/PublicationComments'
import ModifyAccount from "./ModifyAccount"

export default function MainAccount() {

    const history = useHistory()
    const {slug} = useParams()
    const userDataReducer = useSelector(state => state.UserData)
    const themeReducer = useSelector(state => state.Theme)
    const [load, setLoad] = useState(false)
    const [openNewPubli, setOpenNewPubli] = useState(false)
    const [openCommentsPubli, setOpenCommentsPubli] = useState(false)
    const [openModifyAccount, setOpenModifyAccount] = useState(false)
    const [dataUser, setDataUser] = useState(null)
    const [dataPublications, setDataPublications] = useState(null)
    const [dataPubliClick, setDataPubliClick] = useState(null)
    const [isEmpty, setIsEmpty] = useState(true)
    const [url, setUrl] = useState(history.listen((location) => setUrl(location.pathname)))
    
    history.listen((location) => {
        if (location.pathname != url) {
            setUrl(location.pathname)
            setIsEmpty(true)
            setDataPublications(null)
            setDataUser({
                last_name: "",
                first_name: "",
                bio: "",
                likes_total: "",
                publications_total: "",
                friends_total: "",
                profile_image_url: "",
                banner_image_url: ""
            })
        }
    })

    useEffect(async () => {
        setLoad(false)
        
        // Get informations for account
        const id = slug

        await axios.get(`http://localhost:3001/api/user/account/informations/${id}`)
        .then(res => {
            if (res.data.alert) {
                return history.push({pathname: '/error404'})
            } else {
                const data = res.data.userData
                setDataUser({
                    last_name: data.last_name,
                    first_name: data.first_name,
                    bio: data.bio,
                    likes_total: data.likes_total,
                    publications_total: data.publications_total,
                    friends_total: data.friends_total,
                    profile_image_url: data.profile_image_url,
                    banner_image_url: data.banner_image_url
                })
            }
        })
        .catch(err => console.log(err))
        
        await axios.get(`http://localhost:3001/api/publications/account/${id}`)
            .then(res => {
                if (res.data.length == 0) {
                    setIsEmpty(true)
                } else {
                    setDataPublications(res.data)
                    setIsEmpty(false)
                    }
                })
            .catch(err => console.log(err))
            setLoad(true)
    }, [url])
    
    const handleOpenCommentsPubli = (dataPubli) => {
        setDataPubliClick(dataPubli)
        setOpenCommentsPubli(!openCommentsPubli)
    }

    const handleOpenModifyAccount = () => {
        setOpenModifyAccount(!openModifyAccount)
    }

    return (
        <section className={themeReducer ? "mainAccount-dark" : "mainAccount"}>

        {load 
        ? openCommentsPubli 
            ? <PublicationComments close={handleOpenCommentsPubli} data={dataPubliClick} /> 
            : <div className="account-content">

                {openNewPubli ? <NewPubliBox /*publi={openNewPubli}*/ setPubli={setOpenNewPubli} />  : null}
                {openModifyAccount ? <ModifyAccount slug={slug} setClose={setOpenModifyAccount} /> : null}

                <div className={themeReducer ? "account-top-dark" : "account-top"}>
                    <div className="account-bg">
                        <img className="account-bg-img" src={dataUser.banner_image_url} alt="Your banner image"/>
                    </div>
                    <div className="account-info">
                        <div className="account-info-top">
                            <div className="account-info-img">
                                <img className="img-profile" src={dataUser.profile_image_url} alt="Your profile image"/>
                            </div>
                            <div>
                                <p className={themeReducer ? "txt-dark" : null}>{dataUser.first_name} {dataUser.last_name}</p>
                            </div>

                        {slug != userDataReducer.user_id
                        ? null 
                        :   <div className="account-modify">
                                <p className={themeReducer ? "txt-dark" : null} onClick={() => handleOpenModifyAccount()}>Modify my account</p>
                                <FontAwesomeIcon icon="edit" className={themeReducer ? "txt-dark" : "edit-icon"}/>
                            </div>
                        }

                        </div>
                        <div className="account-bottom">
                            <div className="account-icon">
                                <div className="account-icon-box">
                                    <FontAwesomeIcon icon="heart" className="heart-icon"/>
                                    <p className={themeReducer ? "account-icon-nbr-dark" : "account-icon-nbr"}>{dataUser.likes_total}</p>
                                </div>
                                <div className="account-icon-box">
                                    <FontAwesomeIcon icon="user-friends" className="user-friends-icon"/>
                                    <p className={themeReducer ? "account-icon-nbr-dark" : "account-icon-nbr"}>{dataUser.friends_total}</p>
                                </div>
                                <div className="account-icon-box">
                                    <FontAwesomeIcon icon="pen" className="pen-icon"/>
                                    <p className={themeReducer ? "account-icon-nbr-dark" : "account-icon-nbr"}>{dataUser.publications_total}</p>
                                </div>
                            </div>
                            <div className="account-bio">
                                <p className={themeReducer ? "txt-dark" : null}>{dataUser.bio}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="account-publi">
                    {slug != userDataReducer.user_id
                    ? null 
                    :   <div className="new-publi">
                            <div className="write-publi" onClick={() => setOpenNewPubli(true)}>
                                <FontAwesomeIcon className={themeReducer ? "icon-new-publi txt-dark" : "icon-new-publi"} icon="comments" />
                                <div className="input-new-publi" type="text">
                                    <p className={themeReducer ? "write-publi-placeholder txt-dark" : "write-publi-placeholder"}>What do you mean ?</p>
                                </div>
                            </div>
                            
                            <div className="bottom-new-publi">
                                <FontAwesomeIcon icon="image" className={themeReducer ? "icon-bottom-new-publi txt-dark" : "icon-bottom-new-publi"}  onClick={() => setOpenNewPubli(true)}/>
                                <p className={themeReducer ? "icon-bottom-new-publi txt-dark" : "icon-bottom-new-publi"}  onClick={() => setOpenNewPubli(true)}>GIF</p>
                            </div>
                        </div>
                    }
                </div>

                {isEmpty 
                ?   <div className="account-empty">
                        <p className={themeReducer ? "txt-dark" : null}>This account seems very empty to me ..</p>
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
   
        : <Loader />}
        </section>
    )
}
