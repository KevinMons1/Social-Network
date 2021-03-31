import React, {useState, useEffect, useRef} from 'react'
import {useSelector} from "react-redux"
import {Link} from "react-router-dom"
import "../../Styles/publication.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import moment from "moment"
import axios from 'axios'
import {useTransition, useSpring, animated} from "react-spring"
import PublicationCardLoader from "./PublicationCardLoader"
import PublicationDelete from "./PublicationDelete"
import Video from "./Video"

export default function PublicationCard({open, data, noClick}) { 

    const themeReducer = useSelector(state => state.Theme)
    const userDataReducer = useSelector(state => state.UserData)
    const [hashtag, setHashtag] = useState("")
    const [deleteAlert, setDeleteAlert] = useState(false)
    const [deleteMsg, setDeleteMsg] = useState(true)
    const [isAnimated, setIsAnimated] = useState(true)
    const [spam, setSpam] = useState(0)
    const [load, setLoad] = useState(false)
    const [isLike, setIsLike] = useState(false)
    const [dataLikes, setDataLikes] = useState(null)

    const transitionLike = useTransition(isAnimated, null, {
        from: { opacity: 0, transform: 'translateY(-20px)', position: 'absolute' },
        enter: { opacity: 1, transform: 'translateY(0px)', position: 'relative'},
        leave: { opacity: 0, transform: 'translateY(-20px)', position: 'absolute' },
    })
    const {x} = useSpring({
        from: {x: 0}, x: isAnimated ? 1 : 0,
        config: {duration: 500}
    })

    useEffect(() => {
        // To separate a long string into several hashtags if there is a need
        if (data.hashtag.length > 0) {
            let _hashtag = data.hashtag
            _hashtag = _hashtag.replace(";", " #")
            _hashtag = "#" + _hashtag
            setHashtag(_hashtag)
        }        

        axios.post(`http://localhost:3001/api/publications/likes/get/${data.publicationId}`, {userId: userDataReducer.userId})
            .then(res => {
                setDataLikes(res.data.like.likesTotal)
                if (res.data.isLike.length > 0) setIsLike(true)
                setLoad(true)
            })
            .catch(err => console.log(err))
        }, [])

    const handleDelete = () => {
        if (data.userId === userDataReducer.userId) {
            axios.delete(`http://localhost:3001/api/publications/account/delete/${data.userId + "-" + data.publicationId}`)
                .then(res => {
                    if (res.data.alert) {
                        setDeleteMsg(false)
                    }
                })
                .catch(err => console.log(err))
            }
    }

    const handleLike = async () => {
        // Anti spam request
        setIsAnimated(!isAnimated)

        if (spam <= 4) {
            if (isLike) {
                await axios.post(`http://localhost:3001/api/publications/like/delete/${data.publicationId}`, {userId: userDataReducer.userId})
                    .then()
                    .catch(err => console.log(err))
            } else if (isLike === false) {
                await axios.post(`http://localhost:3001/api/publications/like/add/${data.publicationId}`, {userId: userDataReducer.userId})
                    .then()
                    .catch(err => console.log(err))
            }
        }
        setSpam(spam + 1)
    }

    const cssDelete = deleteMsg ? themeReducer ? "publi-dark" : "publi" : "publi-none"

    return load ?
        <div className={cssDelete}>

            {deleteAlert ? <PublicationDelete setDeleteAlert={setDeleteAlert} deletePubli={() => handleDelete()} /> : null}

            {data.userId === userDataReducer.userId
            ? <div className="publi-delete-box"> 
                <button className={themeReducer ? "publi-delete-btn-dark" : "publi-delete-btn"} onClick={() => setDeleteAlert(true)}>Delete</button>
              </div>
            : null}

            <div className="publi-top">  
                <div className="info-publi">
                    <div className="left-publi">
                        <div className="left-publi-img-box">
                            <Link to={`/account/${data.userId}`}>
                                <img className="left-publi-img" src={data.userImageUrl} alt="Profile frame"/>
                            </Link>
                        </div>
                        <div className="left-publi-info">
                            <Link to={`/account/${data.userId}`} className={themeReducer ? 'txt-dark' : "left-publi-info-link"}>{data.firstName} {data.lastName}</Link>
                            <small className={themeReducer ? 'txt-dark' : null}>{moment(data.date).fromNow()}</small>
                        </div>
                    </div>
                    <div className="right-publi">
                        <p className={themeReducer ? 'txt-dark' : null}>{hashtag}</p>
                    </div>
                </div>

                <div className="text-publi">
                    <p className={themeReducer ? 'txt-dark' : null} onClick={() => noClick ? null : open(data)}>{data.text}</p>
                </div>
            </div>
                {data.publicationFileUrl != null 
                ?  <div className="bg-publi">
                    {data.type === "image"
                    ?   <img className="bg-publi-img" src={data.publicationFileUrl} onClick={() => noClick ? null : open(data)} alt="Publication frame"/>
                    :   <Video data={data} />     
                    }
                  </div>
                : null}

                <div className="social-publi">
                    <div className="icon-publi-box">
                        <animated.i className="fas fa-heart icon-publi"
                        onClick={() => handleLike()}
                         style={{
                            color: x.interpolate({
                                range: [0, 1],
                                output: isLike ? ['#707070', '#ff4336'] : ['#ff4336', '#707070']
                            }),
                            transform: x.interpolate({
                                range: [0, 0.2, 0.3, 0.5, 0.6, 0.7, 0.8, 1],
                                output: [1, 0.9, 0.5, 1.2, 1, 0.8, 1.1, 1]
                              }).interpolate(x => `scale(${x})`)
                        }}></animated.i>
                        <div className="icon-publi-animation">
                            {transitionLike.map(({item, key, props}) => item 
                                ? <animated.p key={key} style={props} className={themeReducer ? 'txt-dark' : null}>{dataLikes}</animated.p>
                                : <animated.p key={key} style={props} className={themeReducer ? 'txt-dark' : null}>{isLike ? dataLikes - 1 : dataLikes + 1}</animated.p>
                            )}
                        </div>
                    </div>
                    <div className="icon-publi-box">
                        <FontAwesomeIcon className="comment-publi icon-publi" icon="comment" />
                        <p className={themeReducer ? 'txt-dark' : null}>{data.commentsTotal}</p>
                    </div>
                </div>
        </div>
    : <PublicationCardLoader/>
}
