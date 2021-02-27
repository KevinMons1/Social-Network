import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux'
import {createStore, combineReducers} from 'redux'
import Theme from "./Reducer/themeReducer"
import UserData from "./Reducer/userDataReducer"
import ZIndexReduceur from "./Reducer/zIndexReducer"
import {BrowserRouter as Router} from "react-router-dom"

const rootReducer = combineReducers({
  Theme,
  UserData,
  ZIndexReduceur
})

const store = createStore(rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({trace : true})
)

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);

reportWebVitals();
