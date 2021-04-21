import React, { Component } from 'react'
import { HashRouter as Router, Route, Link } from 'react-router-dom'

import Index from './pages/index'
import Test from './pages/test'

export default class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={Index} />
        <Route path="/test" component={Test} />
      </Router>
    )
  }
}
