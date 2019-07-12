import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./component/layout/Navbar";
import Landing from "./component/layout/Landing";
import Login from "./component/auth/Login";
import Register from "./component/auth/Register";
import Alert from "./component/layout/Alert";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utilities/setAuthToken";

// REDUX
import { Provider } from "react-redux";
import store from "./store";

import "./App.css";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    // We dispatch the loadUser action by taking the 'store'
    // directly & call dispatch- a method in the 'store'
    // then pass the loadUser action in it to dispatch it.

    // To stop the 'userEffect HOOK' from running on a constant loop,
    // & only have it run once, when its mounted, we pass an empty
    // array [] as a 2nd argument. This now works like a 'componentDidMount'.
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  )};

export default App;
