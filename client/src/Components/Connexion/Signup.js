import React, {useState} from 'react'
import {Link, useHistory} from "react-router-dom"
import axios from "axios"
import "../../Styles/connexion.css"
import AnimPageConnexion from "../../Assets/Images/anim-page-connexion.gif"

export default function Signup() {

    const history = useHistory()
    const [alertMsg, setAlertMsg] = useState("")
    const [passwordVerify, setPasswordVerify] = useState("")
    const [data, setData] = useState({
        last_name: "",
        first_name: "",
        email: "",
        password: ""
    })

    const verifyInformation = () => {
        let regex = /^[^@&":()!_$*€<>£`'µ§%+=\/;?#]+$/
        let surname = data.last_name
        let name = data.first_name

        if (surname.length > 2 && name.length > 2) {
            if (surname.match(regex) && name.match(regex)) {
                if (data.password.length >= 6) {
                    if (data.password === passwordVerify) {
                        return true
                    } else {
                        setAlertMsg("Your passwords do not match !")
                        return false
                    }
                } else {
                    setAlertMsg("Your password must contain at least 6 characters !")
                    return false
                }
            } else {
                setAlertMsg("Do not use special characters for your name and surname !")
                return false
            }
        } else {
            setAlertMsg("Your name and surname must contain at least 2 characters !")
            return false
        }
    }

    const handleSubmit = e => {
        e.preventDefault()

        if (verifyInformation()) {
            axios.post("http://localhost:3001/api/auth/signup", data)
                .then(res => {
                    setAlertMsg(res.data.message)
                })
                .catch(err => {
                    console.log(err)
                })
                setTimeout(() => {
                    history.push({pathname: '/login'})
                }, 1500)
        }
    }

    const handleChange = e => {
        setData({...data, [e.target.name]: e.target.value})
    }

    return (
        <section className="connexion">
            <div className="connexion-left">
                <div className="connexion-title">
                    <h1>Register</h1>
                </div>
                {alertMsg == "" 
                ?   null 
                :   <div className="connexion-alert">
                        <p>{alertMsg}</p>
                    </div>
                }
                <form className="connexion-form" onSubmit={e => handleSubmit(e)} >
                    <div className="connexion-info">
                        <label htmlFor="email" className="connexion-label">Mail address</label>
                        <input required type="email" name="email" className="connexion-input" onChange={e => handleChange(e)} />
                    </div>
                    <div className="connexion-info connexion-name">
                        <div>
                            <label htmlFor="last_name" className="connexion-label">Last Name</label>
                            <input required type="text" name="last_name" className="connexion-input" onChange={e => handleChange(e)}/>
                        </div>
                        <div>
                            <label htmlFor="first_name" className="connexion-label">First Name</label>
                            <input required type="text" name="first_name" className="connexion-input" onChange={e => handleChange(e)}/>
                        </div>
                    </div>
                    <div className="connexion-info">
                        <label htmlFor="password" className="connexion-label">Password</label>
                        <input required type="password" name="password" className="connexion-input" onChange={e => handleChange(e)}/>
                    </div>
                    <div className="connexion-info">
                        <label htmlFor="passwordVerif" className="connexion-label">Verify Password</label>
                        <input required type="password" name="passwordVerif" className="connexion-input" onChange={e => setPasswordVerify(e.target.value)} />
                    </div>
                    <div className="connexion-submit">
                        <button type="submit" className="connexion-btn">SIGN IN</button>
                    </div>
                </form>
                <div className="connexion-link-box">
                    <Link to="/login" className="connexion-link">Login</Link>
                </div>
            </div>

            <div className="connexion-right">
                <img src={AnimPageConnexion} alt="Animation"/>
            </div>
        </section>
    )
}
