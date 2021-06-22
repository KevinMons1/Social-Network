import React, {useState, useEffect} from 'react'
import "../../Styles/gallery.css"
import "../../Styles/Media-Queries/Tablet/gallery.css"
import {useLocation, useHistory} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import axios from "axios"
import Video from "../Publication/Video"

export default function MainGallery() {  

    const themeReducer = useSelector(state => state.Theme)
    const location = useLocation()
    const history = useHistory()
    const dispatch = useDispatch()
    const [load, setLoad] = useState(false)
    const [isEmptyImage, setIsEmptyImage] = useState(true)
    const [isEmptyVideo, setIsEmptyVideo] = useState(true)
    const [data, setData] = useState([])

    useEffect(() => { 
        // Get informations for account
        let path, idPath
        setLoad(false)
        
        dispatch({
            type: "CHANGE_ZINDEX",
            payload: false
        })

        // Get userId
        path = location.pathname
        idPath = path.substr(9)
        idPath = idPath.split('/')

        const fetchDataAccount = async () => {
            let count = 0 // For stop and detect when forEach find Image and Video
            let count2 = 0 // For stop and detect when forEach find Image and Video
                await axios.get(`${process.env.REACT_APP_URL}api/publications/account/${idPath[0]}`)
                    .then(res => {
                        console.log(res.data)
                        if (res.data.length > 0) {
                            res.data.forEach(publication => {
                                if (publication.publicationFileUrl !== null) {
                                    if (publication.type === "image" && count === 0) {
                                        setIsEmptyImage(false)
                                        count++
                                    }
                                    if (publication.type === "video" && count2 === 1) {
                                        setIsEmptyVideo(false)
                                        count2++
                                    }
                                    return
                                }
                            })
                            setData(res.data)
                        }
                    })
                    .catch(err => console.log(err))
                }
                fetchDataAccount()
                setLoad(true)
        }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

        
    const handleBack = () => {
        let path = location.pathname
        let lastPath = path.split('/gallery')
        history.push(lastPath[0])
    }

    const handleClickPublication = item => {
        let dataGallery = []
        let dataGalleryIndex

        // To seek for slider
        data.forEach(publication => {
            if (publication.type === item.type) dataGallery.push(publication)
        })
        // To search index of this publication
        dataGalleryIndex = dataGallery.findIndex(publication => publication.publicationId === item.publicationId)

        history.push(`/publication/${item.publicationId}`, {
            data: item,
            path: location.pathname,
            isGallery: true,
            dataGallery,
            dataGalleryIndex
        })
    }

    return ( load ?
        <div className={themeReducer ? "mainGallery-dark" : "mainGallery"}>         
            <FontAwesomeIcon onClick={() => handleBack()} icon="arrow-left" className={themeReducer ? "txt-dark gallery-icon" : "gallery-icon"}/>
            <div className="gallery-container">
                <h2 className={themeReducer ? "txt-dark" : null}>Images</h2>
                <div className="gallery-content">
                    {isEmptyImage 
                    ?   <p className={themeReducer ? "gallery-empty txt-dark" : "gallery-empty"}>This gallery seems very empty to me ...</p>
                    :   data.map((item, index) => {
                        return (
                            item.type === "image" 
                            ?   <div onClick={() => handleClickPublication(item)} key={index} className="gallery-img">
                                    <img className="gallery-element" src={item.publicationFileUrl} alt={`Frame publichsed of this user`} />
                                </div>    
                            : null           
                        )})
                    }
                </div>
            </div>
                <div className="gallery-container gallery-container-video">
                    <h2 className={themeReducer ? "txt-dark" : null}>Videos</h2>
                    <div className="gallery-content">                        
                        {isEmptyVideo
                        ?   <p className={themeReducer ? "gallery-empty txt-dark" : "gallery-empty"}>This gallery seems very empty to me ...</p>
                        :   data.map((item, index) => {
                                return (
                                    item.type === "video"
                                    ?   <div onClick={() => handleClickPublication(item)} key={index} className="gallery-video">
                                            <Video clickNo={true} className="gallery-element" data={{publicationFileUrl: item.publicationFileUrl}} />
                                        </div>        
                                    : null     
                            )})
                        }
                    </div>
            </div>
        </div>
    :   <div className="mainGallery"></div>)
}
