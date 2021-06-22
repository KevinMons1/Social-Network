import {useEffect, useState} from "react"
import "./Styles/app.css"
import "./Styles/Media-Queries/Tablet/app.css"
import { useMediaQuery } from 'react-responsive'
import {Route, Switch, useHistory, useLocation} from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux"
import {useTransition, animated, config} from "react-spring"
import Cookie from "js-cookie"

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
import Landing from "./Components/Landing/index"
import Live from "./Components/Gaming/Live"
import FullFile from "./Components/Services/FullFile"
import Login from "./Components/Connexion/Login"
import Signup from "./Components/Connexion/Signup"
import PasswordForget from "./Components/Connexion/PasswordForget"
import ResetPassword from "./Components/Connexion/ResetPassword"
import Error from "./Components/Services/Error"
import Loader from "./Components/Services/Loader"
import Informations from "./Components/Services/Informations"

function App() {

  const themeReduceur = useSelector(state => state.Theme)
  const zIndexReduceur = useSelector(state => state.ZIndexReduceur)
  const themeCookie = Cookie.get("theme")
  const dispatch = useDispatch()
  const location = useLocation()
  const history = useHistory()
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 860px)" })
  const [load, setLoad] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [openInformations, setOpenInformations] = useState(false)
  const verifyPathname = () => {
    // Avoid listen pathname /:slug on root chat for not repeat animation and refresh page each change path
    if (location.pathname.includes("/chat/")) {
      if (location.pathname.includes("/chat/empty")) return true
      return false
    } else return true
  }
  const transitions = useTransition(location, location => location.pathname, {
    from: verifyPathname() ? {opacity: 0, transform: 'translate3d(-50%, 0, 0)'} : {opacity: 1, transform: 'translate3d(0, 0, 0)'},
    enter: verifyPathname() ? {opacity: 1, transform: 'translate3d(0, 0, 0)'} : {opacity: 1, transform: 'translate3d(0, 0, 0)'},
    leave: verifyPathname() ? {opacity: 0, transform: 'translate3d(50%, 0, 0)'} : {opacity: 1, transform: 'translate3d(0, 0, 0)'},
    config: config.stiff
  })

  useEffect(() => {
    const fetch = async () => {
      let data = await Auth.loginWithCookie()

      document.body.classList.add(themeReduceur ? "body-dark" : "body")
      document.body.classList.remove(themeReduceur ? "body" : "body-dark")

      if (Auth.isAuthenticated()) {
        dispatch({
          type: "ADD_DATA",
          payload: data
        })
        dispatch({
          type: 'CHANGE',
          payload:  themeCookie === "true" ? true : false
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
         {authenticated ? <ProtectedRoute component={FullFile} /> : null}
         {authenticated ? <ProtectedRoute openInformations={() => setOpenInformations(true)} component={Header} /> : null}
         {authenticated ? openInformations ? <ProtectedRoute closeInformations={() => setOpenInformations(false)} component={Informations} /> : null : null}
        <div className="container">
          {transitions.map(({item: location, props, key}) => {
            return (
              <animated.div key={key} style={props} className={zIndexReduceur ? "container-anim container-index" : "container-anim"}>
                <Switch location={location}>
                  {authenticated ? <ProtectedRoute isHome={true} exact path="/" component={Home} /> : null}
                  {authenticated ? <ProtectedRoute isHome={false} exact path="/hashtag/:slug" component={Home} /> : null}
                  {authenticated ? <ProtectedRoute exact path="/publication/:slug" component={Publication} />  : null}
                  {authenticated ? <ProtectedRoute exact path="/account/:slug" component={Account} /> : null}
                  {authenticated ? <ProtectedRoute exact path="/account/:slug/gallery" component={Gallery} /> : null}
                  {authenticated ? <ProtectedRoute exact path="/account/:slug/friends" component={Friends} /> : null}
                  {authenticated ? <ProtectedRoute exact path="/gaming" component={Gaming} /> : null}
                  {authenticated ? <ProtectedRoute excat path="/gaming/live/:slug" component={Live} /> : null}
                  {authenticated ? <ProtectedRoute exact path="/chat/:slug" component={Chat} /> : null}
                  {!authenticated ? <Route exact path="/" component={Landing} /> : null}
                  {!authenticated ? <Route exact path="/login" component={Login} /> : null}
                  {!authenticated ? <Route exact path="/signup" component={Signup} /> : null}
                  {!authenticated ? <Route exact path="/password-forget" component={PasswordForget} /> : null} 
                  {!authenticated ? <Route exact path="/reset-password/:slug" component={ResetPassword} /> : null} 
                  <Route path="*" component={Error} />
                </Switch>
              </animated.div>
            )
          })}
        </div>
        {authenticated 
        ? !isTabletOrMobile 
            ? <ProtectedRoute component={Connected} choiceCss={true} /> 
            : null
        : null}
      </div>
  : <Loader />
  )
}

export default App;

