import axios from "axios"
import Cookie from "js-cookie"

const authCookie = Cookie.get("user")

class AuthClass {
    constructor() {
        this.authenticated = false
    }

    login(userData) {
        let data = null
        const fetch = async () => {
            await axios.post("http://localhost:3001/api/auth/login", userData)
                .then(res => {
                   data = res.data
                   if (res.data.alert) this.authenticated = true
                })
                .catch(err => console.log(err))
                return data
            }
        return fetch()
    }

    logout() {
        this.authenticated = false
    }

    loginWithCookie() {
        let data = null
        const fetch = async () => {
            await axios.post("http://localhost:3001/api/auth/login-token", {cookie: authCookie})
                .then(res => {
                    if (res.data.authorization) {
                        this.authenticated = true
                        data = res.data.informations
                    }
                    else {
                        this.authenticated = false
                    }
                })
                .catch(err => console.log(err))
            this.isAuthenticated()
            return data
        }
        return fetch()
    }

    isAuthenticated() {
        return this.authenticated
    }
}

const Auth = new AuthClass()

export default Auth

// import {useState} from "react"
// import axios from "axios"
// import Cookie from "js-cookie"

// const authCookie = Cookie.get("user")
// const [authenticated, setAuthenticated] = useState(false)

// export const login = () => {
//     setAuthenticated(true)
// }

// export const logout = () => {
//     setAuthenticated(false)
// }

// export const loginWithCookie = async () => {
//     let data = null
//     await axios.post("http://localhost:3001/api/auth/login-token", {cookie: authCookie})
//         .then(res => {
//             if (res.data.authorization) {
//                 setAuthenticated(true)
//                 data = res.data.informations
//             }
//             else setAuthenticated(false)
//         })
//         .catch(err => console.log(err))
//         return data
// }