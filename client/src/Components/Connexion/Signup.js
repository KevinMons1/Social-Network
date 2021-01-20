import React, {useState} from 'react'
import {Link} from "react-router-dom"
import axios from "axios"
import "../../Styles/connexion.css"
import AnimPageConnexion from "../../Assets/Images/anim-page-connexion.gif"

export default function Signup() {

    const [data, setData] = useState({
        last_name: "",
        first_name: "",
        email: "",
        password: ""
    })
    const [alertMsg, setAlertMsg] = useState("")

    const verifyInformation = () => {
        let regexp = // continue ici

        console.log(data.password.match(regexp))

        if (data.password.match(regexp)) {
            console.log('oui')
        }
        console.log('non')
    }

    const handleSubmit = e => {
        e.preventDefault()

        verifyInformation()

        axios.post("http://localhost:3001/api/auth/signup", data)
            .then(res => {
                setAlertMsg(res.data.message)
            })
            .catch(err => {
                console.log(err)
            })
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
                        <input type="password" name="passwordVerif" className="connexion-input"/>
                    </div>
                    <div className="connexion-submit">
                        <button required type="submit" className="connexion-btn">SIGN IN</button>
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
