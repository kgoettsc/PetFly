import React from "react";
import { HashRouter as Router, Route, Switch, useParams } from "react-router-dom";
import Users from "../components/Users";
import OrganizationPortal from "../components/OrganizationPortal";
import AddFlight from "../components/AddFlight";
import RescueList from "../components/RescueList";
import Home from "../components/Home";
import HomeContainer from "../components/HomeContainer";
import Rescue from "../components/Rescue";

export default (
  <Router>
    <Switch>
      <Route>
        <HomeContainer>
          <Route path="/" exact component={Home} />
          <Route path="/orgPortal" component={OrganizationPortal} />
          <Route path="/addFlight" component={AddFlight} />
          <Route path="/addRescue" component={Rescue} />
          <Route path="/rescues" component={RescueList} />
          <Route path="/users">
            <Users
              users={['12','34','56a']}/>
          </Route>
          <Route
            path="/rescue/:rescueUuid"
            children={<RescueComponent />} />
        </HomeContainer>
      </Route>
    </Switch>
  </Router>
);

function RescueComponent() {
  let {rescueUuid} = useParams()

  return (
    <Rescue
      rescueUuid={rescueUuid} />
  )
}