//TODO -> Protéger ces Routes plus tard
//TODO -> thème en cookie

import {useEffect, useState} from "react"
import "./Styles/app.css"
import {Route, Switch, useLocation} from 'react-router-dom'
import Cookie from "js-cookie"
import axios from "axios"
import {useDispatch, useSelector} from "react-redux"
import {useTransition, animated, config} from "react-spring"

// Components
import Header from "./Components/Header/Header"
import Connected from "./Components/Connected/Connected"
import Home from "./Components/Home/Index"
import Tchat from "./Components/Tchat/Index"
import Account from "./Components/Account/Index"
import Gaming from "./Components/Gaming/Index"
import Live from "./Components/Gaming/Live"
import Login from "./Components/Connexion/Login"
import Signup from "./Components/Connexion/Signup"
import PasswordForget from "./Components/Connexion/PasswordForget"
import Error from "./Components/Services/Error"
import Loader from "./Components/Services/Loader"

function App() {

  const authCookie = Cookie.get("user")
  const themeReduceur = useSelector(state => state.Theme)
  const zIndexReduceur = useSelector(state => state.ZIndexReduceur)
  const [authorization, setAuthorization] = useState(false)
  const [load, setLoad] = useState(false)
  const dispatch = useDispatch()
  const location = useLocation()
  const verifyPathname = () => {
    // Avoid listen pathname /:slug on root friend for not repeat animation and refresh page each change path
    if (location.pathname.includes("/friends/")) {
      if (location.pathname.includes("/friends/empty")) {
        return true
      }
      return false
    } else {
      return true
    } 
  }
  const transitions = useTransition(location, location => location.pathname, {
    from: verifyPathname() ? {opacity: 0, transform: 'translate3d(-50%, 0, 0)', position: 'absolute'} : {opacity: 1, transform: 'translate3d(0, 0, 0)', position: 'absolute'},
    enter: verifyPathname() ? {opacity: 1, transform: 'translate3d(0%, 0, 0)'} : {opacity: 1, transform: 'translate3d(0, 0, 0)'},
    leave: verifyPathname() ? {opacity: 0, transform: 'translate3d(50%, 0, 0)'} : {opacity: 1, transform: 'translate3d(0, 0, 0)'},
    config: config.stiff
  })

  useEffect(() => {
    const fecthData = async () => {
      await axios.post("http://localhost:3001/api/auth/login-token", {cookie: authCookie})
        .then(res => {
          setAuthorization(res.data.authorization)
          if (res.data.authorization) {
            dispatch({
              type: "ADD_DATA",
              payload: res.data.informations
            })
          }
        })
        .catch(err => console.log(err))
        setLoad(true)
    }
    fecthData()
  }, [])

  return (
    load 
      ? authorization 
        ? 
          <div className={themeReduceur ? "App-dark" : "App"}>
            <Header />
            <div className="container">
              {transitions.map(({item: location, props, key}) => {
                return (
                  <animated.div key={key} style={props} className={zIndexReduceur ? "container-anim container-index" : "container-anim"}>
                    <Switch location={location}>
                      <Route exact path="/" component={Home} /> 
                      <Route exact path="/account/:slug" component={Account} />
                      <Route exact path="/gaming" component={Gaming} />
                      <Route excat path="/gaming/live/:slug" component={Live} />
                      <Route exact path="/friends/:slug" component={Tchat} />
                      <Route component={Error} />
                    </Switch>
                  </animated.div>
                )
              })}
            </div>
            <Connected choiceCss={true} />
          </div>
      
          : <Switch>
            <Route exact path={["/login", "/"]} component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/password-forget" component={PasswordForget} />
            <Route component={Error} />
          </Switch>
      : <Loader />
  );

}

export default App;

