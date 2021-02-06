import React, {useState, useEffect} from 'react'
import {useSelector} from "react-redux"
import "../../Styles/home.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import axios from "axios"
import StoryCard from './StoryCard'
import PublicationCard from '../Publication/PublicationCard'
import NewPubliBox from '../Publication/NewPubliBox'
import PublicationComments from '../Publication/PublicationComments'
import Loader from "../Services/Loader"

export default function MainHome() {

    const [load, setLoad] = useState(false)
    const [newPubli, setNewPubli] = useState(false)
    const [open, setOpen] = useState(false)
    const [data, setData] = useState(null)
    const [dataPubliClick, setDataPubliClick] = useState(null)
    const themeReducer = useSelector(state => state.Theme)

    const handleOpenCommentsPubli = (dataPubli) => {
        setDataPubliClick(dataPubli)
        setOpen(true)
    }

    useEffect(async () => {
        // Get all publications
        await axios.get("http://localhost:3001/api/publications/all")
        .then(res => {
                setData(res.data)
            })
        .catch(err => console.log(err))

        setLoad(true)
    }, [])

    const handleCloseCommentsPubli = () => {
        setOpen(false)
    }

    return (
        <section className={themeReducer ? "mainHome-dark" : "mainHome"}>
            {open 
            ? <PublicationComments close={handleCloseCommentsPubli} data={dataPubliClick} /> 
            : 
            <div>
                {newPubli ? <NewPubliBox publi={newPubli} setPubli={setNewPubli} />  : null}

                <div className="storys">
                    <div className={themeReducer ? "story-add border-dark" : "story-add"}>
                        <FontAwesomeIcon icon="plus" className={themeReducer ? "story-icon txt-dark" : "story-icon"}/>
                    </div>
                <StoryCard />
                </div>

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

                <div>
                    {load 
                    ? data.map((item, index) => {
                        return (
                            <div key={index} className="box-publi">
                                <PublicationCard open={handleOpenCommentsPubli} data={item} />
                            </div>
                        )
                    })
                    : <Loader />
                    }
                </div>

            </div>
            }
        </section>
    )
}
