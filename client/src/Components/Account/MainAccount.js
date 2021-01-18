import React, {useState, useEffect} from 'react'
import {useSelector} from "react-redux"
import "../../Styles/account.css"
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
    const themeReducer = useSelector(state => state)

    useEffect(() => {
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
        <section className={themeReducer.Theme ? "mainAccount-dark" : "mainAccount"}>

        {open 
        ? <PublicationComments close={handleOpen} /> 
        : <div>
            {newPubli ? <NewPubliBox publi={newPubli} setPubli={setNewPubli} />  : null}

            <div className={themeReducer.Theme ? "account-top-dark" : "account-top"}>
                <div className="account-bg">
                    <img className="account-bg-img" src={BgDefault} alt="Your profile banner"/>
                </div>
                <div className="account-info">
                    <div className="account-info-top">
                        <div className="account-info-img">
                            <img className="img-profile" src={ProfilDefault} alt="Your frame profile"/>
                            <div>
                                <p className={themeReducer.Theme ? "txt-dark" : null}>Tom Mohy</p>
                            </div>
                        </div>
                        <div className="account-modify">
                            <p className={themeReducer.Theme ? "txt-dark" : null}>Modify my account</p>
                            <FontAwesomeIcon icon="edit" className={themeReducer.Theme ? "txt-dark" : "edit-icon"}/>
                        </div>
                    </div>
                    <div className="account-bottom">
                        <div className="account-icon">
                            <div className="account-icon-box">
                                <FontAwesomeIcon icon="heart" className="heart-icon"/>
                                <p className={themeReducer.Theme ? "account-icon-nbr-dark" : "account-icon-nbr"}>398</p>
                            </div>
                            <div className="account-icon-box">
                                <FontAwesomeIcon icon="user-friends" className="user-friends-icon"/>
                                <p className={themeReducer.Theme ? "account-icon-nbr-dark" : "account-icon-nbr"}>106</p>
                            </div>
                            <div className="account-icon-box">
                                <FontAwesomeIcon icon="pen" className="pen-icon"/>
                                <p className={themeReducer.Theme ? "account-icon-nbr-dark" : "account-icon-nbr"}>36</p>
                            </div>
                        </div>
                        <div className="account-bio">
                            <p className={themeReducer.Theme ? "txt-dark" : null}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem consequatur debitis possimus distinctio quo a tempora doloribus, temporibus atque fuga omnis quod iure!</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="account-publi">
                <div className="new-publi">
                    <div className="write-publi" onClick={() => setNewPubli(true)}>
                        <FontAwesomeIcon className={themeReducer.Theme ? "icon-new-publi txt-dark" : "icon-new-publi"} icon="comments" />
                        <div className="input-new-publi" type="text">
                            <p className={themeReducer.Theme ? "write-publi-placeholder txt-dark" : "write-publi-placeholder"}>What do you mean ?</p>
                        </div>
                    </div>
                    <div className="bottom-new-publi">
                        <FontAwesomeIcon icon="image" className={themeReducer.Theme ? "icon-bottom-new-publi txt-dark" : "icon-bottom-new-publi"}  onClick={() => setNewPubli(true)}/>
                        <p className={themeReducer.Theme ? "icon-bottom-new-publi txt-dark" : "icon-bottom-new-publi"}  onClick={() => setNewPubli(true)}>GIF</p>
                    </div>
                </div>
            </div>
            {load ? publicationHtml : <p>...</p>}
        </div>
        }
            
        </section>
    )
}
