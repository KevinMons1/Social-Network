import React, {useState, useEffect} from 'react'
import {useLocation, useHistory} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import axios from "axios"
import PublicationComments from '../Publication/PublicationComments'
import Video from "../Publication/Video"

export default function MainGallery() {  

    const themeReducer = useSelector(state => state.Theme)
    const location = useLocation()
    const history = useHistory()
    const dispatch = useDispatch()
    const [load, setLoad] = useState(false)
    const [isEmpty, setIsEmpty] = useState(false)
    const [data, setData] = useState([])
    const [openCommentsPubli, setOpenCommentsPubli] = useState(false)
    const [dataPubliClick, setDataPubliClick] = useState(false)

    useEffect(() => { 
        // Get informations for account
        let path, idPath
        setLoad(false)
        setIsEmpty(true)
        
        dispatch({
            type: "CHANGE_ZINDEX",
            payload: false
        })

        // Get userId
        path = location.pathname
        idPath = path.substr(9)
        idPath = idPath.split('/')

        const fetchDataAccount = async () => {
                await axios.get(`http://localhost:3001/api/publications/account/${idPath[0]}`)
                    .then(res => {
                        if (res.data.length === 0) {
                        } else {
                            setIsEmpty(false)
                            setData(res.data)
                        }
                    })
                    .catch(err => console.log(err))
                }
                fetchDataAccount()
                setLoad(true)
        }, [location])

        
    const handleClickBack = () => {
        let path = location.pathname
        let lastPath = path.split('/gallery')
        history.push(lastPath[0])
    }

    const handleClickPublication = item => {
        setOpenCommentsPubli(true)
        setDataPubliClick(item)
    }

    const handleCloseCommentsPubli = () => {
        setOpenCommentsPubli(false)
    }

    return ( load ?
        <div className={themeReducer ? "mainGallery-dark" : "mainGallery"}>
             {openCommentsPubli ?
                <PublicationComments close={handleCloseCommentsPubli} data={dataPubliClick} />
                : null}           
                <FontAwesomeIcon onClick={() => handleClickBack()} icon="arrow-left" className={themeReducer ? "txt-dark gallery-icon" : "gallery-icon"}/>
            <div className="gallery-container">
                <h2 className={themeReducer ? "txt-dark" : null}>Images</h2>
                <div className="gallery-content">
                    {isEmpty 
                    ?   <p className="gallery-empty">This gallery seems very empty to me ...</p>
                    :   data.map((item, index) => {
                        return (
                            item.type === "image" 
                            ?   <div onClick={() => handleClickPublication(item)} key={index} className="gallery-img">
                                    <img  className="gallery-element" src={item.publicationFileUrl} alt={`Frame publichsed of this user`} />
                                </div>    
                            : null           
                        )})
                    }
                </div>
            </div>
                <div className="gallery-container gallery-container-video">
                    <h2 className={themeReducer ? "txt-dark" : null}>Videos</h2>
                    <div className="gallery-content">                        
                        {isEmpty 
                        ?   <p className="gallery-empty">This gallery seems very empty to me ...</p>
                        :   data.map((item, index) => {
                                return (
                                    item.type === "video"
                                    ?   <div onClick={() => handleClickPublication(item)} key={index} key={index} className="gallery-video">
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
