import React from 'react'

import { Grid, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

class FlightList extends React.Component {
  constructor(props) {
    super(props)

    this.getFlights()

    this.state = {
      flights: [],
    }
  }

  getFlights(){
    $.ajax({
      url: '/flights/active_by_user',
      method: 'GET',
      contentType: 'application/json',
      success: (data) => {
        console.log("got user flights!")
        let {flights} = data

        this.setState({
          flights
        })
      },
      error: (data) => {
        console.log("error for user flights")
      }
    });
  }

  renderFlightCards() {
    let {
      flights
    } = this.state

    return this.renderDisplayCards(flights)
  }

  renderDisplayCards(flights) {
    let displayList = flights.map((flight, index) => {
      let {
        departing_airport,
        arriving_airport
      } = flight

      return (
        <span
          key={`flights-${index}`}>
          <Button
            size="small"
            component={Link}
            to={"/flight/" + flight.uuid} >
            <b>{flight.number}</b>: {departing_airport.code} => {arriving_airport.code}
          </Button>
        </span>
      )
    })

    return displayList
  }

  render() {
    let flightList = this.renderFlightCards()

    return (
      <div>
        <Grid
          container
          spacing={3} >
          <Grid
            item
            xs={6} >
            <h2>All Active Flights</h2>
            <Button
              size="small"
              component={Link}
              to="addFlight" >
              <b>Add New Flight</b>
            </Button>
            {flightList}
          </Grid>
          <Grid
            item
            xs={6} >
            <h2>Matches</h2>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default FlightList