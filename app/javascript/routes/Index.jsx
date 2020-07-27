import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Users from "../components/Users";
import Home from "../components/Home";
import HomeContainer from "../components/HomeContainer";

export default (
  <Router>
    <Switch>
      <Route>
        <HomeContainer>
          <Route path="/" exact component={Home} />
          <Route path="/users">
            <Users
              users={['12','34','56a']}/>
          </Route>
        </HomeContainer>
      </Route>
    </Switch>
  </Router>
);