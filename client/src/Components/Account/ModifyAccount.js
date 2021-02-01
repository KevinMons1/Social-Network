import React, {useState} from 'react'
import "../../Styles/account.css"
import {useSelector} from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../../Assets/fontawesome"
import axios from "axios"

export default function ModifyAccount({ setClose, slug }) {

    const themeReducer = useSelector(state => state.Theme)
    const userDataReducer = useSelector(state => state.UserData)
    const [imageProfile, setImageProfile] = useState(null)
    const [alertMsg, setAlertMsg] = useState("")
    const [alertCss, setAletCss] = useState(true)
    const [data, setData] = useState({
        last_name: userDataReducer.last_name,
        first_name: userDataReducer.first_name,
        bio: userDataReducer.bio,
        image_profile: userDataReducer.image_profile
    })

    const verifyInformations = () => {
        let regex = /^[^@&":()!_$*€<>£`'µ§%+=\/;?#]+$/
        let name = data.last_name
        let surname = data.first_name
        let bio = data.bio

         if (surname.length > 2 && name.length > 2) {
             if (surname != userDataReducer.first_name || name != userDataReducer.last_name || bio != userDataReducer.bio) {
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
                } else {
                    setAletCss(true)
                    setAlertMsg("You have not modified any information !")
                    return false
                }   
             }  else {
                setAletCss(true)
                setAlertMsg("Your name and surname must contain at least 2 characters !")
                return false
            }             
    }

    const handleSubmit = async e => {
        e.preventDefault()
        
        if (verifyInformations()) {         
            const res = await axios.put(`http://localhost:3001/api/user/account/informations/update/${slug}`, data)
            .then(res => {
                setAletCss(res.data.alert)
                setAlertMsg(res.data.message)
                if (res.data.message === "Modified information !") {
                    setTimeout(() => {
                        window.location.reload()
                    }, 1500)
                }            
            })
            .catch(err => console.log(err))
        }    
    }

    const handleCloseModifyAccount = () => {
        setClose(false)
    }

    const handleChange = e => {
        setData({...data, [e.target.name]: e.target.value})
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
                            <label htmlFor="image_profile" className={themeReducer ? "account-modify-label txt-dark" : "account-modify-label"}>Image Profile</label>
                            <input type="file" name="image_profile" onChange={e => setImageProfile(e.target.files[0])} id="image_profile"/>
                        </div>
                        <div>
                            <label htmlFor="last_name" className={themeReducer ? "account-modify-label txt-dark" : "account-modify-label"}>Last Name</label>
                            <input required type="last_name" name="last_name" className="account-modify-input" defaultValue={userDataReducer.last_name} onChange={e => handleChange(e)} />
                        </div>
                        <div>
                            <label htmlFor="first_name" className={themeReducer ? "account-modify-label txt-dark" : "account-modify-label"}>First Name</label>
                            <input required type="first_name" name="first_name" className="account-modify-input" defaultValue={userDataReducer.first_name} onChange={e => handleChange(e)} />
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

