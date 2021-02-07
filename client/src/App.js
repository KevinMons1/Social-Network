//TODO -> Protéger ces Routes plus tard
//TODO -> thème en cookie

import {useEffect, useState} from "react"
import "./Styles/app.css"
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Cookie from "js-cookie"
import axios from "axios"
import {useDispatch} from "react-redux"

// Components
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
  const [authorization, setAuthorization] = useState(false)
  const [load, setLoad] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    axios.post("http://localhost:3001/api/auth/login-token", {cookie: authCookie})
      .then(res => {
        setAuthorization(res.data.authorization)
        dispatch({
          type: "ADD_DATA",
          payload: res.data.informations
        })
      })
      .catch(err => console.log(err))
      
      setLoad(true)
  }, [])

  return (
    load 
    ? authorization 
      ? <Router>
          <div className="App">
            <Switch>
              <Route exact path="/" component={Home} /> 
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/password-forget" component={PasswordForget} />
              <Route exact path="/tchat" component={Tchat} />
              <Route exact path="/account/:slug" component={Account} />
              <Route exact path="/gaming" component={Gaming} />
              <Route excat path="/gaming/live/:slug" component={Live} />
              <Route component={Error} />
            </Switch>
          </div>
        </Router>
    
        : <Router>
            <div className="App">
              <Switch>
                <Route exact path={["/login", "/"]} component={Login} />
                <Route exact path="/signup" component={Signup} />
                <Route exact path="/password-forget" component={PasswordForget} />
                <Route component={Error} />
              </Switch>
            </div>
          </Router> 
    : <Loader />
  );

}

export default App;

