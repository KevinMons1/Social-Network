//TODO -> Protéger ces Routes plus tard
//TODO -> thème en cookie

import {useEffect, useState} from "react"
import "./Styles/app.css"
import "./Styles/Media-Queries/Tablet/app.css"
import { useMediaQuery } from 'react-responsive'
import {Route, Switch, useHistory, useLocation} from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux"
import {useTransition, animated, config} from "react-spring"

import ProtectedRoute from "./ProtectedRoute"
import Auth from "./Auth"

// Components
import Header from "./Components/Header/Header"
import Connected from "./Components/Connected/Connected"
import Home from "./Components/Home/Index"
import Publication from "./Components/Publication/Index"
import Chat from "./Components/Chat/Index"
import Account from "./Components/Account/Index"
import Gallery from "./Components/Gallery/Index"
import Friends from "./Components/Friends/Index"
import Gaming from "./Components/Gaming/Index"
import Live from "./Components/Gaming/Live"
import FullFile from "./Components/Services/FullFile"
import Login from "./Components/Connexion/Login"
import Signup from "./Components/Connexion/Signup"
import PasswordForget from "./Components/Connexion/PasswordForget"
import Error from "./Components/Services/Error"
import Loader from "./Components/Services/Loader"

function App() {

  const themeReduceur = useSelector(state => state.Theme)
  const zIndexReduceur = useSelector(state => state.ZIndexReduceur)
  const [load, setLoad] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const dispatch = useDispatch()
  const location = useLocation()
  const history = useHistory()
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 860px)" })
  const verifyPathname = () => {
    // Avoid listen pathname /:slug on root chat for not repeat animation and refresh page each change path
    if (location.pathname.includes("/chat/")) {
      if (location.pathname.includes("/chat/empty")) return true
      return false
    } else return true
  }
  const transitions = useTransition(location, location => location.pathname, {
    from: verifyPathname() ? {opacity: 0, transform: 'translate3d(-50%, 0, 0)', position: 'absolute'} : {opacity: 1, transform: 'translate3d(0, 0, 0)', position: 'absolute'},
    enter: verifyPathname() ? {opacity: 1, transform: 'translate3d(0, 0, 0)'} : {opacity: 1, transform: 'translate3d(0, 0, 0)'},
    leave: verifyPathname() ? {opacity: 0, transform: 'translate3d(50%, 0, 0)'} : {opacity: 1, transform: 'translate3d(0, 0, 0)'},
    config: config.stiff
  })

  useEffect(() => {
    const fetch = async () => {
      let data = await Auth.loginWithCookie()
      if (Auth.isAuthenticated()) {
        dispatch({
          type: "ADD_DATA",
          payload: data
        })
        if (location.pathname === "/login") history.push({pathname: '/'})
        setAuthenticated(true)
      } 
      setLoad(true)
    }
    fetch()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    load ? 
      <div className={themeReduceur ? "App-dark" : "App"}>
        <ProtectedRoute component={FullFile} />
        <ProtectedRoute component={Header} />
        <div className="container">
          {transitions.map(({item: location, props, key}) => {
            return (
              <animated.div key={key} style={props} className={zIndexReduceur ? "container-anim container-index" : "container-anim"}>
                <Switch location={location}>
                  <ProtectedRoute isHome={true} exact path="/" component={Home} /> 
                  <ProtectedRoute isHome={false} exact path="/hashtag/:slug" component={Home} />
                  <ProtectedRoute exact path="/publication/:slug" component={Publication} /> 
                  <ProtectedRoute exact path="/account/:slug" component={Account} />
                  <ProtectedRoute exact path="/account/:slug/gallery" component={Gallery} />
                  <ProtectedRoute exact path="/account/:slug/friends" component={Friends} />
                  <ProtectedRoute exact path="/gaming" component={Gaming} />
                  <ProtectedRoute excat path="/gaming/live/:slug" component={Live} />
                  <ProtectedRoute exact path="/chat/:slug" component={Chat} />
                  {!authenticated ? <Route exact path="/login" component={Login} /> : null}
                  {!authenticated ? <Route exact path="/signup" component={Signup} /> : null}
                  {!authenticated ? <Route exact path="/password-forget" component={PasswordForget} /> : null} 
                  <Route component={Error} />
                </Switch>
              </animated.div>
            )
          })}
        </div>
        {!isTabletOrMobile ? <ProtectedRoute component={Connected} choiceCss={true} /> : null}
      </div>
  : <Loader />
  )
}

export default App;

