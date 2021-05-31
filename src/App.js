import React, { Component } from "react";
import { HashRouter, Switch, Route } from "react-router-dom";

// import Index from "./pages/index";
import Outpatient from "./pages/outpatient";
import Inpatient from "./pages/inpatient";
import Test from "./pages/test";

export default class App extends Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/outpatient" component={Outpatient} />
          <Route exact path="/inpatient" component={Inpatient} />
          <Route path="/" component={Test} />
        </Switch>
      </HashRouter>
    );
  }
}
