import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";

import React, {
  Fragment,
  useEffect
} from "react";

// Private & Public Routes
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Routes from "./components/routing/Routes";

// REDUX
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utilities/setAuthToken";
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
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route component={Routes} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
