import React, {useState, useEffect} from 'react'
import {useSelector} from "react-redux"
import "../../Styles/home.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import StoryCard from './StoryCard'
import PublicationCard from '../Publication/PublicationCard'
import NewPubliBox from '../Publication/NewPubliBox'
import PublicationComments from '../Publication/PublicationComments'
import Loader from "../Other/Loader"

export default function MainHome() {

    const [publicationCard, setPublicationCard] = useState([])
    const [load, setLoad] = useState(false)
    const [newPubli, setNewPubli] = useState(false)
    const [open, setOpen] = useState(false)
    const themeReducer = useSelector(state => state)

    const handleOpen = () => {
        setOpen(true)
    }

    useEffect(() => {
        for (let i = 0; i < 10; i++) {
            setPublicationCard(publicationCard => [...publicationCard, <PublicationCard open={handleOpen} />])
        }
        setLoad(true)
    }, [])

    const handleClose = () => {
        setOpen(false)
    }

    const publicationHtml = (
        publicationCard.map((item, index) => {
            return <div className="box-publi" key={index}>{item}</div>
        })                 
    )

    return (
        <section className={themeReducer.Theme ? "mainHome-dark" : "mainHome"}>
            {open 
            ? <PublicationComments close={handleClose} /> 
            : 
            <div>
                {newPubli ? <NewPubliBox publi={newPubli} setPubli={setNewPubli} />  : null}

                <div className="storys">
                    <div className={themeReducer.Theme ? "story-add border-dark" : "story-add"}>
                        <FontAwesomeIcon icon="plus" className={themeReducer.Theme ? "story-icon txt-dark" : "story-icon"}/>
                    </div>
                <StoryCard />
                </div>

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

                <div>
                    {load ? publicationHtml : <div><Loader /></div>}
                </div>

            </div>
            }
        </section>
    )
}
