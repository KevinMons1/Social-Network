import React, {useState} from 'react'
import "../../Styles/account.css"
import {useSelector} from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import axios from "axios"
import imageCompression from "browser-image-compression"
import {useTransition, animated, config} from "react-spring"

export default function ModifyAccount({ setClose, slug }) {

    const themeReducer = useSelector(state => state.Theme)
    const userDataReducer = useSelector(state => state.UserData)
    const [profileImage, setProfileImage] = useState(null)
    const [bannerImage, setBannerImage] = useState(null)
    const [alertMsg, setAlertMsg] = useState("")
    const [alertCss, setAletCss] = useState(true)
    const [dataProfileImgTxt, setDataProfileImgTxt] = useState("")
    const [dataBannerImgTxt, setDataBannerImgTxt] = useState("")
    const [isAnimated, setIsAnimated] = useState(true)
    const transitionContent = useTransition(isAnimated, null, {
        from: {opacity: 0, transform: "scale(0)"},
        enter: {opacity: 1, transform: "scale(1)"},
        leave: {opacity: 0, transform: "scale(0)"},
        config: config.stiff
    })
    const transitionContentOpacity = useTransition(isAnimated, null, {
        from: {opacity: 0},
        enter: {opacity: 0.5},
        leave: {opacity: 0},
        config: config.stiff
    })
    const [data, setData] = useState({
        lastName: userDataReducer.lastName,
        firstName: userDataReducer.firstName,
        bio: userDataReducer.bio
    })

    const verifyInformations = () => {
        let regex = /^[^@&":()!_$*€<>£`'µ§%+=;?#]+$/
        let name = data.lastName
        let surname = data.firstName
        let bio = data.bio

        if (surname !== userDataReducer.firstName || name !== userDataReducer.lastName || bio !== userDataReducer.bio) {
         if (surname.length > 2 && name.length > 2) {
                if (surname.match(regex) && name.match(regex)) {
                    if (bio.length < 250) {
                        return true
                    } else {
                        setAletCss(true)
                        setAlertMsg("Your bio cannot exceed 250 characters !")
                        return false
                    }
                    } else {
                        setAletCss(true)
                        setAlertMsg("Do not use special characters for your name and surname !")
                        return false
                    }
                }  else {
                    setAletCss(true)
                    setAlertMsg("Your name and surname must contain at least 2 characters !")
                    return false
                }   
            }             
    }

    const handleSubmit = async e => {
        e.preventDefault()

        // Modify image profile
        if (profileImage !== null) {
            await handleCompressionImage(profileImage, dataProfileImgTxt, true)           
        }

        // Modify image banner
        if (bannerImage != null) {
            await handleCompressionImage(bannerImage, dataBannerImgTxt, false)           
        }
        
        // Modify informations
        if (verifyInformations()) {    
            await axios.put(`http://localhost:3001/api/user/account/informations/update/${slug}`, data)
                .then(res => {
                    setAletCss(res.data.alert)
                    setAlertMsg(res.data.message)  
                })
                .catch(err => console.log(err))
                setTimeout(() => {
                    window.location.reload()
                }, 500);
            }   
    } 

     // Image compression
     const handleCompressionImage = (image ,txt, choiceImage) => {
        let imageFile = image;     
        let options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        }

        imageCompression(imageFile, options)
          .then(compressedFile => {
                let formData = new FormData()
                formData.append('file', compressedFile)
                formData.append('txt', txt)
                
                console.log(choiceImage)
                if (choiceImage) {
                    axios.put(`http://localhost:3001/api/user/account/image/profile/${slug}`, formData)
                    .then(res => {
                        setAletCss(res.data.alert)
                        setAlertMsg(res.data.message)
                    })
                    .catch(err => console.log(err))
                } else {
                    axios.put(`http://localhost:3001/api/user/account/image/banner/${slug}`, formData)
                    .then(res => {
                        setAletCss(res.data.alert)
                        setAlertMsg(res.data.message)
                    })
                    .catch(err => console.log(err))
                }
          })
          .catch(error => {
            console.log(error.message);
          });
      }
    
    const handleCloseModifyAccount = () => {
        setIsAnimated(!isAnimated)
        setTimeout(() => {
            setClose(false)
        }, 200);
    }

    const handleChange = e => {
        setData({...data, [e.target.name]: e.target.value})
    }

    const handleChangeProfileImgTxt = e => {
        setDataProfileImgTxt(e.target.value)
    }

    const handleChangeBannerImgTxt = e => {
        setDataBannerImgTxt(e.target.value)
    }

    return (
        <div className="account-modify-container">
            {transitionContentOpacity.map(({item, key, props}) => item && (
                <animated.div key={key} style={props} className="account-modify-opacity"></animated.div>
            ))}
            {transitionContent.map(({item, key, props}) => item && (
                <animated.div key={key} style={props} className={themeReducer ? "account-modify-content-dark" : "account-modify-content"}>
                    <button className={themeReducer ? "account-modify-icon-btn-dark" : "account-modify-icon-btn"} onClick={handleCloseModifyAccount}>
                        <FontAwesomeIcon icon="times-circle" className="account-modify-close-icon"/>
                    </button>
                    <form className="account-modify-form" onSubmit={e => handleSubmit(e)}>          
                    {alertMsg === "" 
                    ?   null 
                    :   <div className={alertCss ? "alert-danger account-modify-center" : "alert-success account-modify-center"}>
                            <p>{alertMsg}</p>
                        </div>
                    }
                        <div className="acount-modify-info">
                            <div className="account-modify-info-box">
                                <div className="account-modify-img">
                                    <div className="account-modify-img-box">
                                        <label htmlFor="profileImage" className={themeReducer ? "account-modify-label txt-dark" : "account-modify-label"}>Profile Image</label>
                                        <input type="file" name="profileImage" onChange={e => setProfileImage(e.target.files[0])} id="profileImage" className={themeReducer ? "account-modify-inputFile txt-dark" : "account-modify-inputFile"}/>
                                    </div>
                                    <div>
                                        <input type="text" name="profileImage_txt" className="account-modify-input" onChange={e => handleChangeProfileImgTxt(e)} placeholder="What do you mean ?"/>
                                    </div>
                                </div>
                                <div className="account-modify-img">
                                    <div className="account-modify-img-box">
                                        <label htmlFor="bannerImage" className={themeReducer ? "account-modify-label txt-dark" : "account-modify-label"}>Banner Image</label>
                                        <input type="file" name="bannerImage" onChange={e => setBannerImage(e.target.files[0])} id="bannerImage" className={themeReducer ? "account-modify-inputFile txt-dark" : "account-modify-inputFile"}/>
                                    </div>
                                    <div>
                                        <input type="text" name="bannerImage_txt" className="account-modify-input" onChange={e => handleChangeBannerImgTxt(e)} placeholder="What do you mean ?"/>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="lastName" className={themeReducer ? "account-modify-label txt-dark" : "account-modify-label"}>Last Name</label>
                                <input required type="text" name="lastName" className="account-modify-input" defaultValue={userDataReducer.lastName} onChange={e => handleChange(e)} />
                            </div>
                            <div>
                                <label htmlFor="firstName" className={themeReducer ? "account-modify-label txt-dark" : "account-modify-label"}>First Name</label>
                                <input required type="text" name="firstName" className="account-modify-input" defaultValue={userDataReducer.firstName} onChange={e => handleChange(e)} />
                            </div>
                            <div>
                                <label htmlFor="bio" className={themeReducer ? "account-modify-label txt-dark" : "account-modify-label"}>Bio</label>
                                <textarea type="bio" name="bio" className="account-modify-input" defaultValue={userDataReducer.bio} onChange={e => handleChange(e)} />
                            </div>
                        </div>
                        <button className={themeReducer ? "account-modify-btn-dark" : "account-modify-btn"}>UPDATE</button>
                    </form>
                </animated.div>
            ))}
        </div>
    )
}

