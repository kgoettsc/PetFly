import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';

import moment from 'moment'

import { Card, CardActions, Typography, Button, CardContent, Chip } from '@material-ui/core'

import * as ApiUtils from '../packs/apiUtils.js'
import { Send, Check, ArrowForward } from '@material-ui/icons'

class RescueCard extends React.Component {

  requestRescueFlight() {
    let {
      rescueFlight,
      onRescueFlightComplete
    } = this.props

    let {
      rescue,
      flight
    } = rescueFlight

    $.ajax({
      url: `/rescue_flights/create_as_flight`,
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
      rescueFlight
    } = this.props

    let {
      rescue
    } = rescueFlight

    let {
      animal,
      organization,
      receiving_user,
      departing_airports,
      arriving_airports
    } = rescue

    let requested = rescueFlight && rescueFlight.status == "requested"

    let rescueFlightbutton = requested ? (
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
        onClick={this.requestRescueFlight.bind(this, rescue.uuid)}
        endIcon={<Send fontSize='small' />}>
        Request
      </Button>
    )

    let departingAirportInfos = departing_airports.map((airport) => {
      return (
        <div
          key={`depAirport-${airport.uuid}`}>
          <b>{airport.code}</b> - {airport.name}
        </div>
      )
    })

    let arrivingAirportInfos = arriving_airports.map((airport) => {
      return (
        <div
          key={`arrAirport-${airport.uuid}`}>
          <b>{airport.code}</b> - {airport.name}
        </div>
      )
    })

    return (
      <Card variant="outlined">
        <CardContent>
          <div>
            <Typography
              variant='h3'
              style={{display: 'inline'}}>
              {animal.name}
            </Typography>
            <Button
              size="small"
              component={Link}
              to={"/rescue/" + rescue.uuid} >
              View Rescue
            </Button>
          </div>
          <div
            style={{width: '100%', height: '70px'}}>
            <div
              style={{float: 'left', width:'35%'}}>
              {departingAirportInfos}
            </div>
            <div
              style={{float: 'left', paddingLeft: '10px', paddingRight: '10px'}}>
              <ArrowForward
                size='medium' />
            </div>
            <div
              style={{float: 'left', width: '35%'}}>
              {arrivingAirportInfos}
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

RescueCard.propTypes = {
  rescueFlight: PropTypes.object,
  onRescueFlightComplete: PropTypes.func
}

export default RescueCard