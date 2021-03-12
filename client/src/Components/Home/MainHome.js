import React, {useState, useEffect, useRef} from 'react'
import {useSelector, useDispatch} from "react-redux"
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

    const themeReducer = useSelector(state => state.Theme)
    const dispatch = useDispatch()
    const scrollRef = useRef()
    const [countPublication, setCountPublication] = useState(3)
    const [load, setLoad] = useState(false)
    const [newPubli, setNewPubli] = useState(false)
    const [openCommentsPubli, setOpenCommentsPubli] = useState(false)
    const [data, setData] = useState([])
    const [alertMsg, setAlertMsg] = useState(false)
    const [dataPubliClick, setDataPubliClick] = useState(null)

    useEffect(() => {
        // Get publications
        async function fetchData() {
            await dispatch({
                type: "CHANGE_ZINDEX",
                payload: false
              })
            await getPublications()
        }
        fetchData()
    }, [])
    
    const getPublications = () => {
        axios.get(`http://localhost:3001/api/publications/home/${countPublication}`)
        .then(res => {
            if (res.data === false) {
                setAlertMsg(true)
            } else {
                setData([...data, res.data[0], res.data[1], res.data[2]])
                setLoad(true)
            }
            setCountPublication(countPublication + 3)
        })
        .catch(err => console.log(err))
    }

    const handleOpenCommentsPubli = (dataPubli) => {
        setDataPubliClick(dataPubli)
        setOpenCommentsPubli(true)
    }

    const handleCloseCommentsPubli = () => {
        setOpenCommentsPubli(false)
    }

    // Scroll infini -> get publications with scroll
    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
        
        if (clientHeight + scrollTop >= scrollHeight - 20) {
            getPublications()
        }
    }

    return (
        <div ref={scrollRef} className={themeReducer ? "mainHome-dark" : "mainHome"} onScroll={() => handleScroll()}>
        
            {openCommentsPubli ? <PublicationComments close={handleCloseCommentsPubli} data={dataPubliClick} /> : null } 

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
                    {alertMsg ? <p className="home-alertMsg">There is no more publication! Come back later :)</p> : null}
                </div>
            </div>
        </div>
    )
}
