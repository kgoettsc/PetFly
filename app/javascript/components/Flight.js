import React from 'react'

import RescueCard from "../components/RescueCard";

import moment from 'moment'

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import { Grid, IconButton, TextField, Typography, Button } from '@material-ui/core';

import { Autocomplete } from '@material-ui/lab';

import { Save, Edit, Cancel, ArrowDownward } from '@material-ui/icons';

import * as ApiUtils from '../packs/apiUtils.js'
import * as DateUtils from '../packs/dateUtils.js'

class Flight extends React.Component {

  constructor(props){
    super(props)

    this.getFlight()
    this.getRescueFlights()
    this.getAirports()


    let {
      flightUuid
    } = this.props

    this.state = {
      airports: [],
      dupeFlight: {},
      flight: {
        uuid: "",
        number: "",
        departing_at: "",
        arriving_at: "",
        departing_airport_uuid: "",
        arriving_airport_uuid: "",
        departing_airport: null,
        arriving_airport: null,
        can_transport: false,
        departing_airport: {},
        arriving_airport: {},
      },
      editMode: !flightUuid,
      isSaving: false,
      rescueFlights: [],
    }
  }

  getAirports() {
    $.ajax({
      url: `/airports`,
      method: 'GET',
      contentType: 'application/json',
      success: (data) => {
        console.log("got the airports!")
        let {
          airports
        } = data

        this.setState({
          airports
        })
      },
      error: (data) => {
        console.log("error for airports")
      }
    });
  }

  getRescueFlights() {
    let {
      flightUuid,
    } = this.props

    if (!flightUuid) {
      return
    }

    $.ajax({
      url: `/rescue_flights/by_flight`,
      method: 'GET',
      data: {
        flight_uuid: flightUuid,
      },
      contentType: 'application/json',
      success: (data) => {
        console.log("got the rescue_flights!")
        let {
          rescue_flights
        } = data

        this.setState({
          rescueFlights: rescue_flights,
        })
      },
      error: (data) => {
        console.log("error for rescue_flights")
      }
    });
  }

  getFlight() {
    let {
      flightUuid
    } = this.props

    if (!flightUuid) {
      return
    }

    $.ajax({
      url: `/flights/${flightUuid}`,
      method: 'GET',
      contentType: 'application/json',
      success: (data) => {
        console.log("got the flight!")
        let {
          flight
        } = data

        this.setState({
          flight,
          dupeFlight: _.cloneDeep(flight),
        })
      },
      error: (data) => {
        console.log("error for flight")
      }
    });
  }

  saveFlight() {
    this.setState({
      isSaving: true
    })

    let {
      flight,
    } = this.state

    let url = flight.uuid ? `/flights/${flight.uuid}` : '/flights'
    let method = flight.uuid ? `PUT` : 'POST'

    let params = {
      "number": flight.number,
      "can_transport": flight.can_transport,
      "departing_at": flight.departing_at,
      "arriving_at": flight.arriving_at,
      "departing_airport_uuid": flight.departing_airport.uuid,
      "arriving_airport_uuid": flight.arriving_airport.uuid,
    }

    $.ajax({
      url: url,
      method: method,
      data: JSON.stringify(params),
      contentType: 'application/json',
      headers: {
        'X-CSRF-Token': ApiUtils.getCsrfToken(document),
      },
      success: (data) => {
        let {
          flight
        } = data
        console.log(`saved the flight for ${flight.uuid}`)

        this.setState({
          isSaving: false,
          editMode: false,
          flight,
          dupeFlight: _.cloneDeep(flight)
        })
      },
      error: (data) => {
        console.log("error for flight")
        this.setState({
          isSaving: false
        })
      }
    });
  }

  renderArea() {
    let {
      editMode
    } = this.state

    return editMode ? this.renderEditArea() : this.renderDisplayArea()
  }

  renderDisplayArea() {
    let {
      flight,
    } = this.state

    let {
      departing_airport,
      arriving_airport
    } = flight

    let displayArea = (
      <div>
        <div>
          <Typography
            variant='h3'
            style={{display: 'inline'}}>
            {flight.number}
          </Typography>
          <IconButton
            size='small'
            onClick={this.setEditMode(true).bind(this)}>
            <Edit
              fontSize='small'/>
          </IconButton>
        </div>
        <div
          style={{width: '300px', paddingTop: '30px'}}>
          <div
            style={{width: '300px', margin:'auto'}}>
            <Typography
              variant='h5'>
              <b>{departing_airport.code}</b> - {departing_airport.name}
            </Typography>
            <div>
              {moment(flight.departing_at).format('LLLL')}
            </div>
          </div>
          <div>
            <div
              style={{width: '50px', margin:'auto', paddingTop: '30px', paddingBottom: '30px'}}>
              <ArrowDownward
                size='large' />
            </div>
          </div>
          <div
            style={{width: '300px', margin:'auto'}}>
            <Typography
              variant='h5'>
              <b>{arriving_airport.code}</b> - {arriving_airport.name}
            </Typography>
            <div>
              {moment(flight.arriving_at).format('LLLL')}
            </div>
          </div>
        </div>
      </div>
    )

    return displayArea
  }

  renderEditArea() {
    let {
      airports,
      flight,
      isSaving,
    } = this.state

    let editArea = (
      <div>
        <div>
          <TextField
            required
            onChange={this.saveNumber.bind(this)}
            airports={airports}
            label='Flight Number'
            style={{width: '300px'}}
            value={flight.number} />
          <IconButton
            size='small'
            disabled={isSaving}
            onClick={this.saveFlight.bind(this)}>
            <Save
              fontSize='small'/>
          </IconButton>
          {flight.uuid && (
            <IconButton
              size='small'
              onClick={this.onCancel.bind(this)}>
              <Cancel
                fontSize='small'/>
            </IconButton>
          )}
        </div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDateTimePicker
            variant="inline"
            size='small'
            minDateMessage=""
            label="Date/Time of Departure"
            value={DateUtils.shiftTzDate(flight.departing_at)}
            onChange={this.saveDepartingDate.bind(this)}
            onError={console.log}
            disablePast
            format="yyyy/MM/dd HH:mm"
          />
        </MuiPickersUtilsProvider>
        <span
          style={{display:'block', height:45}}>
          <Autocomplete
            options={airports}
            value={flight.departing_airport}
            onChange={this.saveDepartingAirport.bind(this)}
            getOptionLabel={(airport) => `${airport.code} - ${airport.name}`}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Departure Airport"
              />
            )}
          />
        </span>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDateTimePicker
            variant="inline"
            size='small'
            minDateMessage=""
            label="Date/Time of Arrival"
            value={DateUtils.shiftTzDate(flight.arriving_at)}
            onChange={this.saveArrivingDate.bind(this)}
            onError={console.log}
            disablePast
            format="yyyy/MM/dd HH:mm"
          />
        </MuiPickersUtilsProvider>
        <span
          style={{display:'block', height:45}}>
          <Autocomplete
            options={airports}
            value={flight.arriving_airport}
            onChange={this.saveArrivingAirport.bind(this)}
            getOptionLabel={(airport) => `${airport.code} - ${airport.name}`}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Arriving Airport"
              />
            )}
          />
        </span>
      </div>
    )

    return editArea
  }

  onCancel() {
    let {
      dupeFlight
    } = this.state

    this.setState({
      flight: _.cloneDeep(dupeFlight),
      editMode: false
    })
  }

  setEditMode = (editMode) => (e) => {
    this.setState({
      editMode: editMode,
    })
  }

  saveNumber(event) {
    let {
      flight
    } = this.state

    flight.number = event.target.value

    this.setState({
      flight
    })
  }

  saveDepartingDate(date) {
    let {
      flight
    } = this.state

    flight.departing_at = DateUtils.shiftPickerDate(date)

    this.setState({
      flight
    })
  }

  saveArrivingDate(date) {
    let {
      flight
    } = this.state

    flight.arriving_at = DateUtils.shiftPickerDate(date)

    this.setState({
      flight
    })
  }

  saveDepartingAirport(event, newValue) {
    let {
      flight
    } = this.state

    flight.departing_airport = newValue

    this.setState({
      flight
    })
  }

  saveArrivingAirport(event, newValue) {
    let {
      flight
    } = this.state

    flight.arriving_airport = newValue

    this.setState({
      flight
    })
  }

  renderMatchArea(){
    let {
      rescueFlights
    } = this.state

    let displayList = rescueFlights.map((rescueFlight, index) => {

      return (
        <RescueCard
          key={`rescuecard-${index}`}
          rescueFlight={rescueFlight}
          onRescueFlightComplete={this.onRescueFlightComplete.bind(this)} />
      )
    })

    return (
      <div>
        {displayList}
      </div>
    )
  }

  onRescueFlightComplete(rescueFlight) {
    let {
      rescueFlights
    } = this.state

    let index = _.findIndex(rescueFlights, (eachRescueFlight) => {
      return rescueFlight.uuid == eachRescueFlight.uuid
    })

    rescueFlights[index] = rescueFlight


    this.setState({
      rescueFlights
    })
  }

  render() {
    let dataArea = this.renderArea()
    let matchArea = this.renderMatchArea()

    return (
      <div>
        <Grid
          container
          spacing={3} >
          <Grid
            item
            xs={6} >
            {dataArea}
          </Grid>
          <Grid
            item
            xs={6} >
            <h2>Matches</h2>
            {matchArea}
          </Grid>
        </Grid>
      </div>
    )
  }

}

export default Flight