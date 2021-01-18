import "./Styles/app.css"
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

// Components
import Home from "./Components/Home/Index"
import Tchat from "./Components/Tchat/Index"
import Account from "./Components/Account/Index"
import Gaming from "./Components/Gaming/Index"
import Live from "./Components/Gaming/Live"
import Login from "./Components/Connexion/Login"
import Signup from "./Components/Connexion/Signup"
import PasswordForget from "./Components/Connexion/PasswordForget"

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Home} /> 
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/password-forget" component={PasswordForget} />
          <Route exact path="/tchat" component={Tchat} />
          <Route exact path="/account" component={Account} />
          <Route exact path="/gaming" component={Gaming} />
          <Route excat path="/gaming/live/:slug" component={Live} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
