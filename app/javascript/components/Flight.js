import React from 'react'

import moment from 'moment'

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import { Grid, IconButton, TextField, Chip } from '@material-ui/core';

import { Autocomplete } from '@material-ui/lab';

import { Save, Search } from '@material-ui/icons';

import * as ApiUtils from '../packs/apiUtils.js'

class Flight extends React.Component {

  constructor(props){
    super(props)

    this.getAirports()

    let {
      flightUuid
    } = this.props

    this.state = {
      airports: [],
      flight: {
        uuid: "",
        number: "",
        departing_at: "",
        arriving_at: "",
        departing_date: moment.utc().startOf('day').format(),
        arriving_date: moment.utc().startOf('day').format(),
        departing_airport_uuid: "",
        arriving_airport_uuid: "",
        can_transport: false
      },
      selectedDepartingAirport: null,
      selectedArrivingAirport: null,
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

        this.setAirports()

        this.setState({
          airports
        })

        this.setAirports()
      },
      error: (data) => {
        console.log("error for airports")
      }
    });
  }

  setAirports() {
    let {
      airports,
      flight
    } = this.state

    if (!flight.uuid || airports == []) {
      return
    }

    let selectedDepartingAirport = _.findLast(airports, (airport) => {
      return flight.departing_airport_uuid === airport.uuid
    })

    let selectedArrivingAirport = _.findLast(airports, (airport) => {
      return flight.arriving_airport_uuid === airport.uuid
    })

    this.setState({
      selectedDepartingAirport,
      selectedArrivingAirport
    })

  }

  saveFlight() {
    this.setState({
      isSaving: true
    })

    let {
      flight,
      selectedDepartingAirport,
      selectedArrivingAirport
    } = this.state

    let url = flight.uuid ? `/flights/${flight.uuid}` : '/flights'
    let method = flight.uuid ? `PUT` : 'POST'

    let params = {
      "number": flight.number,
      "can_transport": flight.can_transport,
      "departing_date": flight.departing_date,
      "arriving_date": flight.arriving_date,
      "departing_airport_uuid": selectedDepartingAirport.uuid,
      "arriving_airport_uuid": selectedArrivingAirport.uuid,
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
          flight
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

  searchFlightNumber() {
    let {
      flight
    } = this.state


  }

  renderArea() {
    let {
      editMode
    } = this.state

    return editMode ? this.renderEditArea() : this.renderDisplayArea()
  }

  renderDisplayArea() {
    let {
      flight
    } = this.state

    let displayArea = (
      <div>

      </div>
    )

    return displayArea
  }

  renderEditArea() {
    let {
      airports,
      flight,
      isSaving,
      selectedDepartingAirport,
      selectedArrivingAirport
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
            onClick={this.searchFlightNumber.bind(this)}>
            <Search
              fontSize='small'/>
          </IconButton>
          <IconButton
            size='small'
            disabled={isSaving}
            onClick={this.saveFlight.bind(this)}>
            <Save
              fontSize='small'/>
          </IconButton>
        </div> <span
          style={{display:'block', height:45}}>
          <Autocomplete
            options={airports}
            value={selectedDepartingAirport}
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
            value={selectedArrivingAirport}
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
    this.setState({
      selectedDepartingAirport: newValue
    })
  }

  saveArrivingAirport(event, newValue) {
    this.setState({
      selectedArrivingAirport: newValue
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