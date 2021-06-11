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
            await axios.post(`${process.env.REACT_APP_URL}api/auth/login`, userData)
                .then(res => {
                   data = res.data
                   if (res.data.alert) this.authenticated = true
                })
                .catch(err => console.log(err))
                return data
            }
        return fetch()
    }

    loginGoogle(userData) {
        let data = null
        const fetch = async () => {
            await axios.post(`${process.env.REACT_APP_URL}api/auth/login-google`, userData)
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
            await axios.post(`${process.env.REACT_APP_URL}api/auth/login-token`, {cookie: authCookie})
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
