import React, {useState, useEffect} from 'react'
import "../../Styles/account.css"
import {useSelector} from "react-redux"
import {useParams, useHistory} from "react-router-dom"
import axios from "axios"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import ProfilDefault from "../../Assets/Images/profil_default.jpg"
import BgDefault from "../../Assets/Images/bg_default.jpg"
import NewPubliBox from '../Publication/NewPubliBox'
import PublicationCard from '../Publication/PublicationCard'
import PublicationComments from '../Publication/PublicationComments'

export default function MainAccount() {

    const [publicationCard, setPublicationCard] = useState([])
    const [load, setLoad] = useState(false)
    const [newPubli, setNewPubli] = useState(false)
    const [open, setOpen] = useState(false)
    const [hide, setHide] = useState(true)
    const [dataUser, setDataUser] = useState({
        last_name: "",
        first_name: ""    
    })
    const themeReducer = useSelector(state => state.Theme)
    const userDataReducer = useSelector(state => state.UserData)
    const {slug} = useParams()
    const history = useHistory()

    useEffect(() => {

        axios.post("http://localhost:3001/api/user/account/informations", {id: slug})
            .then(res => {
                if (res.data.alert) {
                    history.push({pathname: '/error404'})
                } else {
                    setDataUser({
                        last_name: res.data.userData.last_name,
                        first_name: res.data.userData.first_name
                    })
                }

                // If it is not his account, hide certain elements
                if (slug == userDataReducer.id) {
                    setHide(false)
                }
            })
            .catch(err => console.log(err))

        for (let i = 0; i < 10; i++) {
            setPublicationCard(publicationCard => [...publicationCard, <PublicationCard open={handleOpen} />])
        }
        setLoad(true)
    }, [])
    
    const handleOpen = () => {
        setOpen(!open)
    }

    const publicationHtml = (
        publicationCard.map((item, index) => {
            return <div className="box-publi" key={index}>{item}</div>
        })                 
    )

    return (
        <section className={themeReducer ? "mainAccount-dark" : "mainAccount"}>

        {open 
        ? <PublicationComments close={handleOpen} /> 
        : <div>
            {newPubli ? <NewPubliBox publi={newPubli} setPubli={setNewPubli} />  : null}

            <div className={themeReducer ? "account-top-dark" : "account-top"}>
                <div className="account-bg">
                    <img className="account-bg-img" src={BgDefault} alt="Your profile banner"/>
                </div>
                <div className="account-info">
                    <div className="account-info-top">
                        <div className="account-info-img">
                            <img className="img-profile" src={ProfilDefault} alt="Your frame profile"/>
                            <div>
                                <p className={themeReducer ? "txt-dark" : null}>{dataUser.first_name} {dataUser.last_name}</p>
                            </div>
                        </div>
                       {hide ? null : 
                        <div className="account-modify">
                            <p className={themeReducer ? "txt-dark" : null}>Modify my account</p>
                            <FontAwesomeIcon icon="edit" className={themeReducer ? "txt-dark" : "edit-icon"}/>
                        </div>
                    }
                    </div>
                    <div className="account-bottom">
                        <div className="account-icon">
                            <div className="account-icon-box">
                                <FontAwesomeIcon icon="heart" className="heart-icon"/>
                                <p className={themeReducer ? "account-icon-nbr-dark" : "account-icon-nbr"}>398</p>
                            </div>
                            <div className="account-icon-box">
                                <FontAwesomeIcon icon="user-friends" className="user-friends-icon"/>
                                <p className={themeReducer ? "account-icon-nbr-dark" : "account-icon-nbr"}>106</p>
                            </div>
                            <div className="account-icon-box">
                                <FontAwesomeIcon icon="pen" className="pen-icon"/>
                                <p className={themeReducer ? "account-icon-nbr-dark" : "account-icon-nbr"}>36</p>
                            </div>
                        </div>
                        <div className="account-bio">
                            <p className={themeReducer ? "txt-dark" : null}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem consequatur debitis possimus distinctio quo a tempora doloribus, temporibus atque fuga omnis quod iure!</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="account-publi">
                {hide ? null :
                    <div className="new-publi">
                        <div className="write-publi" onClick={() => setNewPubli(true)}>
                            <FontAwesomeIcon className={themeReducer ? "icon-new-publi txt-dark" : "icon-new-publi"} icon="comments" />
                            <div className="input-new-publi" type="text">
                                <p className={themeReducer ? "write-publi-placeholder txt-dark" : "write-publi-placeholder"}>What do you mean ?</p>
                            </div>
                        </div>
                        
                        <div className="bottom-new-publi">
                            <FontAwesomeIcon icon="image" className={themeReducer ? "icon-bottom-new-publi txt-dark" : "icon-bottom-new-publi"}  onClick={() => setNewPubli(true)}/>
                            <p className={themeReducer ? "icon-bottom-new-publi txt-dark" : "icon-bottom-new-publi"}  onClick={() => setNewPubli(true)}>GIF</p>
                        </div>
                    </div>
                }
            </div>
            {load ? publicationHtml : <p>...</p>}
        </div>
        }
            
        </section>
    )
}
