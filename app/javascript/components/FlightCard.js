import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';

import moment from 'moment'

import { Card, CardActions, Typography, Button, CardContent, Chip } from '@material-ui/core'

import * as ApiUtils from '../packs/apiUtils.js'
import { Send, Check, ArrowForward } from '@material-ui/icons'

class FlightCard extends React.Component {

  requestRescueFlight() {
    let {
      flight,
      rescue,
      onRescueFlightComplete
    } = this.props

    console.log(`requesting for ${flight.uuid}`)

    $.ajax({
      url: `/rescue_flights/create_as_rescue`,
      method: 'POST',
      data: JSON.stringify({
        rescue_uuid: rescue.uuid,
        flight_uuid: flight.uuid
      }),
      contentType: 'application/json',
      headers: {
        'X-CSRF-Token': ApiUtils.getCsrfToken(document),
      },
      success: (data) => {
        console.log("requested rescue flight!")
        let {
          rescue_flight
        } = data

        onRescueFlightComplete(rescue_flight)
      },
      error: (data) => {
        console.log("error for requesting rescue flight")
        console.log(data)
      }
    });
  }

  render(){
    let {
      flight,
      rescue,
      rescueFlight
    } = this.props

    let {
      departing_airport,
      arriving_airport
    } = flight

    let rescueFlightbutton = rescueFlight ? (
      <Chip
        icon={<Check />}
        label="Requested"
        color="primary"
      />
    ) : (
      <Button
        size="small"
        variant="contained"
        color="secondary"
        onClick={this.requestRescueFlight.bind(this, flight.uuid)}
        endIcon={<Send fontSize='small' />}>
        Request
      </Button>
    )

    return (
      <Card variant="outlined">
        <CardContent>
          <div>
            <Typography
              variant='h3'
              style={{display: 'inline'}}>
              {flight.number}
            </Typography>
            <Button
              size="small"
              component={Link}
              to={"/flight/" + flight.uuid} >
              View Flight
            </Button>
          </div>
          <div
            style={{width: '100%', height: '70px'}}>
            <div
              style={{float: 'left', width: '30%'}}>
              <div>
                <b>{departing_airport.code}</b> - {departing_airport.name}
              </div>
              <div>
                {moment(flight.departing_at).format('LLLL')}
              </div>
            </div>
            <div
              style={{float: 'left', paddingLeft: '10px', paddingRight: '10px'}}>
              <ArrowForward
                size='medium' />
            </div>
            <div
              style={{float: 'left', width: '30%'}}>
              <div>
                <b>{arriving_airport.code}</b> - {arriving_airport.name}
              </div>
              <div>
                {moment(flight.arriving_at).format('LLLL')}
              </div>
            </div>
          </div>
        </CardContent>
        <CardActions>
          {rescueFlightbutton}
        </CardActions>
      </Card>
    )
  }
}

FlightCard.propTypes = {
  flight: PropTypes.object,
  rescue: PropTypes.object,
  rescueFlight: PropTypes.object,
  onRescueFlightComplete: PropTypes.func
}

export default FlightCard