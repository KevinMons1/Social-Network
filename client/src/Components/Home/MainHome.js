import React, {useState, useEffect, useRef} from 'react'
import {useSelector, useDispatch} from "react-redux"
import {useLocation, useHistory, useParams} from "react-router-dom"
import "../../Styles/home.css"
import "../../Styles/Media-Queries/Tablet/home.css"
import "../../Styles/Media-Queries/MobileL/home.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import axios from "axios"
import PublicationCard from '../Publication/PublicationCard'
import NewPubliBox from '../Publication/NewPubliBox'
import Loader from "../Services/Loader"
import SuggestFriendCard from '../Services/SuggestFriendCard'

export default function MainHome({ isHome }) {

    const themeReducer = useSelector(state => state.Theme)
    const userDataReducer = useSelector(state => state.UserData)
    const dataHomeReducer = useSelector(state => state.DataHome)
    const dispatch = useDispatch()
    const scrollRef = useRef()
    const location = useLocation()
    const history = useHistory()
    let { slug } = useParams()
    const [load, setLoad] = useState(false)
    const [countPublication, setCountPublication] = useState(3)
    const [newPubli, setNewPubli] = useState(false)
    const [data, setData] = useState([])
    const [dataSuggestFriend, setDataSuggestFriend] = useState([])
    const [alertMsg, setAlertMsg] = useState(false)
    const [lockedBottom, setLockecBottom] = useState(true)

    window.onbeforeunload = (event) => {
        const e = event || window.event;
        e.preventDefault();
        if (e) history.replace({...history.location, state: false})
    }

    useEffect(() => {
        if (location.state) {
            setData(dataHomeReducer.publications)
            setDataSuggestFriend(dataHomeReducer.suggestFirends)
            setCountPublication(dataHomeReducer.countPublication)
            setLoad(true)
            setTimeout(() => {
                scrollRef.current.scrollTop = dataHomeReducer.scrollTop
            }, 200);
        } else {
            // Get publications
            const fetchData = async () => {
                await dispatch({
                    type: "CHANGE_ZINDEX",
                    payload: false
                })
                await dispatch({type: "RESET"})
                await getPublications()
                await getSuggestFriend()
                }
            fetchData()
        }
        }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const getPublications = () => {
        if (isHome) {
            axios.get(`${process.env.REACT_APP_URL}api/publications/home/${countPublication}`)
                .then(res => {
                    if (res.data === false  || res.data.length === 0) {
                        setAlertMsg(true)
                    } else {
                        switch (res.data.length) {
                            case 1:
                                setData(item => [...item, res.data[0]])
                                break;
    
                            case 2: 
                                setData(item => [...item, res.data[0], res.data[1]])
                                break;
                        
                            default:
                                setData(item => [...item, res.data[0], res.data[1], res.data[2]])
                                break;
                        }
                    }
                    setLockecBottom(true)
                    setCountPublication(countPublication + 3)
                    setLoad(true)
                })
                .catch(err => console.log(err))

        } else if (!isHome) {
            const regex = /^[^@&":()!_$*€<>£`'µ§%+=;?#]+$/

            if (slug.match(regex) && slug !== null && slug !== undefined) {
                slug = slug.toLowerCase()

                axios.get(`${process.env.REACT_APP_URL}api/publications/hashtag/${countPublication}`, {
                    params: {
                        hashtag: slug
                        }
                    })
                .then(res => {
                    if (res.data === false  || res.data.length === 0) {
                        setAlertMsg(true)
                    } else {
                        switch (res.data.length) {
                            case 1:
                                setData(item => [...item, res.data[0]])
                                break;
    
                            case 2: 
                                setData(item => [...item, res.data[0], res.data[1]])
                                break;
                        
                            default:
                                setData(item => [...item, res.data[0], res.data[1], res.data[2]])
                                break;
                        }
                    }
                    setCountPublication(countPublication + 3)
                    setLoad(true)
                })
                .catch(err => console.log(err))
            } else {
                history.push("/")
            }
        }
    }

    const getSuggestFriend = async () => {
        await axios.get(`${process.env.REACT_APP_URL}api/user/suggest/friend/${userDataReducer.userId}`)
            .then(res => {
                setDataSuggestFriend(res.data)
            })
            .catch(err => console.log(err))   
    }

    // Scroll infini -> get publications with scroll
    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
        if (clientHeight + scrollTop >= scrollHeight - 50) {
            setLockecBottom(false)
            getPublications()
        }
    }

    // Save position and data
    const handleClickPublication = () => {
        const { scrollTop } = scrollRef.current
        dispatch({
            type: 'CHANGE_DATA_HOME',
            payload: {
                publications: data,
                suggestFirends: dataSuggestFriend,
                scrollTop,
                countPublication: countPublication
            }
        })
    }

    return (
        <div ref={scrollRef} className={themeReducer ? "mainHome-dark" : "mainHome"} onScroll={() => lockedBottom ? handleScroll() : null}>
        
            <div className="mainHome-top">
                {newPubli ? <NewPubliBox publi={newPubli} setPubli={setNewPubli} />  : null}

                <div className="new-publi">
                   {!newPubli ? <div className="write-publi" onClick={() => setNewPubli(true)}>
                        <FontAwesomeIcon className={themeReducer ? "icon-new-publi txt-dark" : "icon-new-publi"} icon="comments" />
                        <div className="input-new-publi" type="text">
                            <p className={themeReducer ? "write-publi-placeholder txt-dark" : "write-publi-placeholder"}>What do you mean ?</p>
                        </div>
                    </div> : null}
                </div>
            <div>
                {load 
                    ?  <div className="suggest-friend">
                            <p className={themeReducer ? "txt-dark" : null}>You know this persons ?</p>
                            <div className="suggest-friend-container">           
                                <div className="suggest-friend-content">
                                    {dataSuggestFriend.map((item, index) => {
                                        return <SuggestFriendCard key={index} data={item} />
                                    })}                
                                </div>
                            </div>
                        </div>                                              
                    :   null}

                    {!isHome
                    ?   <div className="home-hashtag-box">
                            <div className="home-hashtag">#{slug}</div>
                        </div>
                    : null}

                    {load 
                    ?   data.map((item, index) => {
                            return (
                                <div onClick={() => handleClickPublication()} key={index} className="box-publi">
                                    <PublicationCard data={item} />
                                </div>
                            )
                        })
                    :   <Loader />}

                   {!lockedBottom 
                    ? <div className="home-loader-publication">
                        <Loader isMini={true} />
                       </div>
                    : null}
                    {alertMsg ? <p className={themeReducer ? "home-alertMsg txt-dark" : "home-alertMsg"}>There is no more publication! Come back later 👌</p> : null}
                </div>
            </div>
        </div>
    )
}
