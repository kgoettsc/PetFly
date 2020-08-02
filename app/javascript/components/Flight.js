import React from 'react'

import moment from 'moment'

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import { Grid, IconButton, TextField, Chip, Typography } from '@material-ui/core';

import { Autocomplete } from '@material-ui/lab';

import { Save, Edit, Cancel } from '@material-ui/icons';

import * as ApiUtils from '../packs/apiUtils.js'

class Flight extends React.Component {

  constructor(props){
    super(props)

    this.getAirports()
    this.getFlight()

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
        departing_date: moment.utc().startOf('day').format(),
        arriving_date: moment.utc().startOf('day').format(),
        departing_airport_uuid: "",
        arriving_airport_uuid: "",
        departing_airport: null,
        arriving_airport: null,
        can_transport: false
      },
      editMode: !flightUuid,
      isSaving: false
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
          dupeFlight: _.cloneDeep(flight)
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
      "departing_date": flight.departing_date,
      "arriving_date": flight.arriving_date,
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

    let displayArea = (
      <div>
        <div>
          <Typography
            variant='h5'
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
        <Typography
          variant='h5'>
          {flight.departing_airport &&
            `${flight.departing_date} - (${flight.departing_airport.code}) ${flight.departing_airport.name}`
          }
        </Typography>
        <Typography
          variant='h5'>
          {flight.departing_airport &&
            `${flight.departing_date} - (${flight.arriving_airport.code}) ${flight.arriving_airport.name}`
          }
        </Typography>
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
        </div> <span
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
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            size='small'
            format="MM/dd/yyyy"
            margin="normal"
            label="Departing Date"
            InputLabelProps={{shrink: flight.departing_date !== null}}
            value={flight.departing_date}
            onChange={this.saveDepartingDate.bind(this)}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            size='small'
            format="MM/dd/yyyy"
            margin="normal"
            label="Arriving Date"
            InputLabelProps={{shrink: flight.arriving_date !== null}}
            value={flight.arriving_date}
            onChange={this.saveArrivingDate.bind(this)}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>
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

    flight.departing_date = moment.utc(date)

    this.setState({
      flight
    })
  }

  saveArrivingDate(date) {
    let {
      flight
    } = this.state

    flight.arriving_date = moment.utc(date)

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

  render() {
    let dataArea = this.renderArea()

    return (
      <div>
        This is where you add a flight
        <Grid
          container
          spacing={3} >
          <Grid
            item
            xs={6} >
            {dataArea}
          </Grid>
        </Grid>
      </div>
    )
  }

}

export default Flight