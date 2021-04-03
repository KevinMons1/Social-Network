import React, {useState, useEffect, useRef} from 'react'
import {useSelector, useDispatch} from "react-redux"
import "../../Styles/home.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import axios from "axios"
import StoryCard from './StoryCard'
import PublicationCard from '../Publication/PublicationCard'
import NewPubliBox from '../Publication/NewPubliBox'
import Loader from "../Services/Loader"
import SuggestFriendCard from '../Services/SuggestFriendCard'

export default function MainHome() {

    const themeReducer = useSelector(state => state.Theme)
    const userDataReducer = useSelector(state => state.UserData)
    const dispatch = useDispatch()
    const scrollRef = useRef()
    const [countPublication, setCountPublication] = useState(3)
    const [load, setLoad] = useState(false)
    const [newPubli, setNewPubli] = useState(false)
    const [data, setData] = useState([])
    const [dataSuggestFriend, setDataSuggestFriend] = useState([])
    const [alertMsg, setAlertMsg] = useState(false)

    useEffect(() => {
        // Get publications
        const fetchData = async () => {
            await dispatch({
                type: "CHANGE_ZINDEX",
                payload: false
              })
              await getPublications()
              await getSuggestFriend()
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
 
    const getSuggestFriend = async () => {
        await axios.get(`http://localhost:3001/api/user/suggest/friend/${userDataReducer.userId}`)
            .then(res => {
                setDataSuggestFriend(res.data)
            })
            .catch(err => console.log(err))   
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
                    {load 
                    ?   data.map((item, index) => {
                            return (
                                <div key={index} className="box-publi">
                                    <PublicationCard data={item} />
                                </div>
                            )
                        })
                    :   <Loader />}
                    {alertMsg ? <p className="home-alertMsg">There is no more publication! Come back later :)</p> : null}
                </div>
            </div>
        </div>
    )
}
