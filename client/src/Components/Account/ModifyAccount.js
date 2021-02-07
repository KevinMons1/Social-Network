import React, {useState} from 'react'
import "../../Styles/account.css"
import {useSelector} from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import axios from "axios"

export default function ModifyAccount({ setClose, slug }) {

    const themeReducer = useSelector(state => state.Theme)
    const userDataReducer = useSelector(state => state.UserData)
    const [profileImage, setProfileImage] = useState(null)
    const [bannerImage, setBannerImage] = useState(null)
    const [alertMsg, setAlertMsg] = useState("")
    const [alertCss, setAletCss] = useState(true)
    const [dataProfileImgTxt, setDataProfileImgTxt] = useState("")
    const [dataBannerImgTxt, setDataBannerImgTxt] = useState("")
    const [data, setData] = useState({
        last_name: userDataReducer.last_name,
        first_name: userDataReducer.first_name,
        bio: userDataReducer.bio
    })

    const verifyInformations = () => {
        let regex = /^[^@&":()!_$*€<>£`'µ§%+=;?#]+$/
        let name = data.last_name
        let surname = data.first_name
        let bio = data.bio

        if (surname !== userDataReducer.first_name || name !== userDataReducer.last_name || bio !== userDataReducer.bio) {
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
            let formData = new FormData()
            formData.append('file', profileImage)
            formData.append('txt', dataProfileImgTxt)
            
            await axios.put(`http://localhost:3001/api/user/account/image/profile/${slug}`, formData)
                .then(res => {
                    setAletCss(res.data.alert)
                    setAlertMsg(res.data.message)
                })
                .catch(err => console.log(err))
        }

        // Modify image banner
        if (bannerImage != null) {
            let formData = new FormData()
            formData.append('file', bannerImage)
            formData.append('txt', dataBannerImgTxt)
            
            await axios.put(`http://localhost:3001/api/user/account/image/banner/${slug}`, formData)
                .then(res => {
                    setAletCss(res.data.alert)
                    setAlertMsg(res.data.message)
                })
                .catch(err => console.log(err))
        }
        
        // Modify informations
        if (verifyInformations()) {    
            await axios.put(`http://localhost:3001/api/user/account/informations/update/${slug}`, data)
                .then(res => {
                    setAletCss(res.data.alert)
                    setAlertMsg(res.data.message)  
                })
                .catch(err => console.log(err))
        }   

        window.location.reload()
    } 
    
    const handleCloseModifyAccount = () => {
        setClose(false)
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
            <div className="account-modify-opacity"></div>
            <div className={themeReducer ? "account-modify-content-dark" : "account-modify-content"}>
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
                                    <label htmlFor="profile_image" className={themeReducer ? "account-modify-label txt-dark" : "account-modify-label"}>Profile Image</label>
                                    <input type="file" name="profile_image" onChange={e => setProfileImage(e.target.files[0])} id="profile_image" className={themeReducer ? "account-modify-inputFile txt-dark" : "account-modify-inputFile"}/>
                                </div>
                                <div>
                                    <input type="text" name="profile_image_txt" className="account-modify-input" onChange={e => handleChangeProfileImgTxt(e)} placeholder="What do you mean ?"/>
                                </div>
                            </div>
                            <div className="account-modify-img">
                                <div className="account-modify-img-box">
                                    <label htmlFor="banner_image" className={themeReducer ? "account-modify-label txt-dark" : "account-modify-label"}>Banner Image</label>
                                    <input type="file" name="banner_image" onChange={e => setBannerImage(e.target.files[0])} id="banner_image" className={themeReducer ? "account-modify-inputFile txt-dark" : "account-modify-inputFile"}/>
                                </div>
                                <div>
                                    <input type="text" name="banner_image_txt" className="account-modify-input" onChange={e => handleChangeBannerImgTxt(e)} placeholder="What do you mean ?"/>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="last_name" className={themeReducer ? "account-modify-label txt-dark" : "account-modify-label"}>Last Name</label>
                            <input required type="text" name="last_name" className="account-modify-input" defaultValue={userDataReducer.last_name} onChange={e => handleChange(e)} />
                        </div>
                        <div>
                            <label htmlFor="first_name" className={themeReducer ? "account-modify-label txt-dark" : "account-modify-label"}>First Name</label>
                            <input required type="text" name="first_name" className="account-modify-input" defaultValue={userDataReducer.first_name} onChange={e => handleChange(e)} />
                        </div>
                        <div>
                            <label htmlFor="bio" className={themeReducer ? "account-modify-label txt-dark" : "account-modify-label"}>Bio</label>
                            <textarea type="bio" name="bio" className="account-modify-input" defaultValue={userDataReducer.bio} onChange={e => handleChange(e)} />
                        </div>
                    </div>
                    <button className={themeReducer ? "account-modify-btn-dark" : "account-modify-btn"}>UPDATE</button>
                </form>
            </div>
        </div>
    )
}

