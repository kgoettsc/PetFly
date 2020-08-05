import React from "react";
import { HashRouter as Router, Route, Switch, useParams } from "react-router-dom";
import OrganizationPortal from "../components/OrganizationPortal";
import Flight from "../components/Flight";
import FlightList from "../components/FlightList";
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
          <Route path="/addFlight" component={Flight} />
          <Route path="/flights" component={FlightList} />
          <Route path="/addRescue" component={Rescue} />
          <Route path="/rescues" component={RescueList} />
          <Route
            path="/rescue/:rescueUuid"
            children={<RescueComponent />} />
          <Route
            path="/flight/:flightUuid"
            children={<FlightComponent />} />
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

function FlightComponent() {
  let {flightUuid} = useParams()

  return (
    <Flight
      flightUuid={flightUuid} />
  )
}