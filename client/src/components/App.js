import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { hot } from "react-hot-loader/root";

import "../assets/scss/main.scss";
import Main from "./Main"
import TopBar from "./TopBar"

const App = (props) => {
  return (
    <Router>
      {/* <Route path="/" component={TopBar}/> */}
      <Switch>
        <Route path="/" component={Main}/>
      </Switch>
    </Router>
  );
};

export default hot(App);
