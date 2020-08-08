import React from 'react'
import PropTypes from "prop-types"
import { Link } from 'react-router-dom';

import FlightCard from "../components/FlightCard";

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';

import _ from 'lodash'

import { TextField, IconButton, Select, MenuItem, Typography, FormControl, InputLabel, Grid, Chip, Input, Button } from '@material-ui/core'

import { Autocomplete } from '@material-ui/lab';

import { Save, Edit, Cancel, Send, Check } from '@material-ui/icons';

import * as ApiUtils from '../packs/apiUtils.js'
import * as DateUtils from '../packs/dateUtils.js'

class Rescue extends React.Component {
  constructor(props) {
    super(props)

    let {
      rescueUuid
    } = props

    this.getOrganizations()
    this.getAirports()
    this.getRescue()
    this.getMatches()

    this.state = {
      rescue: {
        uuid: "",
        name: "",
        kind: "",
        breed: "",
        available_from: "",
        status: "active",
        info_url: "",
        organization_uuid: "",
        organization_name: "",
        receiving_user_email: "",
        receiving_user_first_name: "",
        receiving_user_last_name: "",
      },
      selectedFromAirports: [],
      selectedToAirports: [],
      isSaving: false,
      organizations: [],
      airports: [],
      editMode: !rescueUuid,
      matches: [],
      rescueFlightMap: {}
    }
  }

  getMatches() {
    let {
      rescueUuid
    } = this.props

    if (!rescueUuid) {
      return
    }

    $.ajax({
      url: `/rescues/${rescueUuid}/matches`,
      method: 'GET',
      contentType: 'application/json',
      success: (data) => {
        console.log("got the matches!")
        let {
          matches
        } = data

        this.setState({
          matches,
        })

        this.getRescueFlights()
      },
      error: (data) => {
        console.log("error for matches")
      }
    });
  }

  getRescueFlights() {
    let {
      rescueUuid,
    } = this.props

    let {
      matches,
    } = this.state

    if (!rescueUuid || !matches || matches == []) {
      return
    }
    let flightUuids = matches.map((flight) => {
      return flight.uuid
    })

    $.ajax({
      url: `/rescue_flights/by_rescue_and_flights`,
      method: 'GET',
      data: {
        rescue_uuid: rescueUuid,
        flight_uuids: flightUuids
      },
      contentType: 'application/json',
      success: (data) => {
        console.log("got the rescue_flights!")
        let {
          rescue_flights
        } = data

        this.setState({
          rescueFlightMap: this.parseRescueFlights(rescue_flights),
        })
      },
      error: (data) => {
        console.log("error for rescue_flights")
      }
    });
  }

  parseRescueFlights(rescueFlights) {
    let rescueFlightMap = {}

    rescueFlights.forEach((rescueFlight) => {
      rescueFlightMap[rescueFlight.flight_uuid] = rescueFlight
    })

    return rescueFlightMap
  }

  getOrganizations() {
    $.ajax({
      url: '/organizations',
      method: 'GET',
      contentType: 'application/json',
      success: (data) => {
        console.log("got orgs!")
        let {organizations} = data

        this.setState({
          organizations
        })
      },
      error: (data) => {
        console.log("error for orgs")
      }
    });
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

  getRescue() {
    let {
      rescueUuid
    } = this.props

    if (!rescueUuid) {
      return
    }

    $.ajax({
      url: `/rescues/${rescueUuid}`,
      method: 'GET',
      contentType: 'application/json',
      success: (data) => {
        console.log("got the rescue!")
        let rescue = this.mapRescueData(data.rescue)

        this.setAirports()

        this.setState({
          rescue,
          editMode: false
        })

        this.setAirports()
      },
      error: (data) => {
        console.log("error for rescue")
      }
    });
  }

  saveRescue() {
    this.setState({
      isSaving: true
    })

    let {
      rescue,
      selectedFromAirports,
      selectedToAirports
    } = this.state

    let url = rescue.uuid ? `/rescues/${rescue.uuid}` : '/rescues'
    let method = rescue.uuid ? `PUT` : 'POST'

    let fromAirportCodes = selectedFromAirports.map((airport) => {
      return airport.code
    })
    let toAirportCodes = selectedToAirports.map((airport) => {
      return airport.code
    })

    let params = {
      "name": rescue.name,
      "kind": rescue.kind,
      "breed": rescue.breed,
      "status": rescue.status,
      "available_from": rescue.available_from,
      "info_url": rescue.info_url,
      "from_airports": fromAirportCodes,
      "to_airports": toAirportCodes,
      "organization_uuid": rescue.organization_uuid,
      "receiving_user_email": rescue.receiving_user_email,
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
        let rescue = this.mapRescueData(data.rescue)
        console.log(`saved the rescue for ${rescue.uuid}`)

        this.setState({
          isSaving: false,
          editMode: false,
          rescue
        })
      },
      error: (data) => {
        console.log("error for countries2")
        this.setState({
          isSaving: false
        })
      }
    });
  }

  mapRescueData(rescueData) {
    let rescue = {}

    //rescue info
    rescue.uuid = rescueData.uuid
    rescue.status = rescueData.status
    rescue.available_from = rescueData.available_from || ""
    rescue.from_airports = rescueData.from_airports
    rescue.to_airports = rescueData.to_airports

    //animal info
    rescue.name = rescueData.animal.name
    rescue.kind = rescueData.animal.kind
    rescue.breed = rescueData.animal.breed
    rescue.info_url = rescueData.animal.info_url

    // org info
    rescue.organization_uuid = rescueData.organization.uuid
    rescue.organization_name = rescueData.organization.name

    //receiving user info
    rescue.receiving_user_email = rescueData.receiving_user.email || ""
    rescue.receiving_user_first_name = rescueData.receiving_user.first_name
    rescue.receiving_user_last_name = rescueData.receiving_user.last_name

    return rescue
  }

  setAirports() {
    let {
      airports,
      rescue
    } = this.state

    if (!rescue.uuid || airports == []) {
      return
    }

    let selectedFromAirports = _.filter(airports, (airport) => {
      return _.includes(rescue.from_airports, airport.code)
    })

    let selectedToAirports = _.filter(airports, (airport) => {
      return _.includes(rescue.to_airports, airport.code)
    })

    this.setState({
      selectedFromAirports,
      selectedToAirports
    })

  }

  setEditMode = (editMode) => (e) => {
    this.setState({
      editMode: editMode,
    })
  }

  renderArea() {
    let {
      editMode
    } = this.state

    return editMode ? this.renderEditArea() : this.renderDisplayArea()
  }

  renderDisplayArea() {
    let {
      rescue,
      selectedFromAirports,
      selectedToAirports
    } = this.state

    let displayArea = (
      <div>
        <Typography
          variant='h5'>
          {rescue.organization_name}
        </Typography>
        <div>
          <Typography
            variant='h3'
            style={{display: 'inline'}}>
            {rescue.name}
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
          {_.capitalize(rescue.kind)}
        </Typography>
        <Typography
          variant='h5'>
          {rescue.breed}
        </Typography>
        <span
          style={{display:'block', height:45}}>
          <b>Travel Need Status: </b> {this.renderStatus(rescue.status)}
        </span>
        <Typography
          variant='h5'>
          Drop Off Airports:
            <br/>
            {selectedFromAirports.map((airport, index) => {
              return (
                <div
                  key={`fromAirport-${index}`}
                  style={{paddingLeft: '15px'}}>
                  <b>{airport.code}</b> - {airport.name}
                </div>
              )
            })}
        </Typography>
        <Typography
          variant='h5'>
          Pick Up Airports:
            <br/>
            {selectedToAirports.map((airport, index) => {
              return (
                <div
                  key={`toAirport-${index}`}
                  style={{paddingLeft: '15px'}}>
                  <b>{airport.code}</b> - {airport.name}
                </div>
              )
            })}
        </Typography>
        {rescue.info_url &&
          <Typography
            variant='h5'>
            <a
              href={rescue.info_url} >
            Link to Rescue
            </a>
          </Typography> }
        {rescue.receiving_user_email &&
          <Typography
            variant='h5'>
            {`${rescue.receiving_user_first_name} ${rescue.receiving_user_last_name}`}
          </Typography> }
      </div>
    )

    return displayArea
  }

  renderStatus(status) {
    let color = ''

    if (status === 'active') {
      color = '#02a114'
    } else if (status === 'pending') {
      color = '#fcba03'
    } else if (status === 'closed') {
      color = '#ad0c00'
    }

    return (
      <span
        style={{color: color}}>
        {_.capitalize(status)}
      </span>
    )
  }

  renderEditArea() {
    let {
      airports,
      isSaving,
      rescue,
      organizations,
      selectedFromAirports,
      selectedToAirports
    } = this.state

    let orgSelects = organizations.map((organization, index) => {
      return (
        <MenuItem
          key={`orgSelect-${index}`}
          value={organization.uuid}>
          {organization.name}
        </MenuItem>
      )
    })

    let editArea = (
      <div>
        <FormControl>
          <InputLabel>
            Organization
          </InputLabel>
          <Select
            value={rescue.organization_uuid}
            onChange={this.saveOrg.bind(this)}
            label='Organization'
            style={{width: '300px'}}>
            {orgSelects}
          </Select>
        </FormControl>
        <div>
          <TextField
            required
            onChange={this.saveName.bind(this)}
            label='Name'
            style={{width: '300px'}}
            value={rescue.name} />
          <IconButton
            size='small'
            disabled={isSaving}
            onClick={this.saveRescue.bind(this)}>
            <Save
              fontSize='small'/>
          </IconButton>
          <IconButton
            size='small'
            onClick={this.setEditMode(false).bind(this)}>
            <Cancel
              fontSize='small'/>
          </IconButton>
        </div>
        <FormControl>
          <InputLabel>
            Kind
          </InputLabel>
          <Select
            value={rescue.kind}
            onChange={this.saveKind.bind(this)}
            label='Kind'
            style={{width: '300px'}}>
            <MenuItem value='dog'>Dog</MenuItem>
            <MenuItem value='cat'>Cat</MenuItem>
            <MenuItem value='balrog'>Balrog</MenuItem>
          </Select>
        </FormControl>
        <TextField
          required
          onChange={this.saveBreed.bind(this)}
          label='Breed'
          style={{width: '300px'}}
          value={rescue.breed}/>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              size='small'
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-available"
              label="Date Available For Travel"
              InputLabelProps={{shrink: rescue.available_from !== null}}
              value={DateUtils.shiftTzDate(rescue.available_from)}
              onChange={this.saveAvailableFrom.bind(this)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
        </MuiPickersUtilsProvider>
        <TextField
          required
          onChange={this.saveInfoUrl.bind(this)}
          label='Info URL'
          style={{width: '300px'}}
          value={rescue.info_url}/>
        <TextField
          required
          onChange={this.saveReceivingUser.bind(this)}
          label='Receiving User'
          style={{width: '300px'}}
          value={rescue.receiving_user_email}/>
        <FormControl>
          <InputLabel>
            Travel Need Status
          </InputLabel>
          <Select
            value={rescue.status}
            onChange={this.saveStatus.bind(this)}
            label='Status'
            style={{width: '300px'}}>
            <MenuItem
              value='active'
              style={{color: '#02a114'}}>Active</MenuItem>
            <MenuItem
              value='pending'
              style={{color: '#fcba03'}}>Pending</MenuItem>
            <MenuItem
              value='closed'
              style={{color: '#ad0c00'}}>Closed</MenuItem>
          </Select>
        </FormControl>
        <span
          style={{display:'block', height:45}}>
          <Autocomplete
            multiple
            id="tags-outlined"
            options={airports}
            value={selectedFromAirports}
            onChange={this.saveFromAirports.bind(this)}
            renderTags={(selected, getTagProps) => (
              <div>
                {selected.map((value) => {
                  return (
                    <Chip
                      key={value.uuid}
                      label={`${value.code} - ${value.name}`} />
                  )
                })}
              </div>
            )}
            getOptionLabel={(airport) => `${airport.code} - ${airport.name}`}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Eligible From Airports"
              />
            )}
          />
        </span>
        <span
          style={{display:'block', height:45}}>
          <Autocomplete
            multiple
            id="tags-outlined"
            options={airports}
            value={selectedToAirports}
            onChange={this.saveToAirports.bind(this)}
            renderTags={(selected, getTagProps) => (
              <div>
                {selected.map((value) => {
                  return (
                    <Chip
                      key={value.uuid}
                      label={`${value.code} - ${value.name}`} />
                  )
                })}
              </div>
            )}
            getOptionLabel={(airport) => `${airport.code} - ${airport.name}`}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Eligible To Airports"
              />
            )}
          />
        </span>
      </div>
    )

    return editArea
  }

  saveOrg(event) {
    let {rescue} = this.state;

    rescue.organization_uuid = event.target.value

    this.setState({
      rescue
    })
  }

  saveName(event) {
    let {rescue} = this.state;

    rescue.name = event.target.value

    this.setState({
      rescue
    })
  }

  saveKind(event) {
    let {rescue} = this.state;

    rescue.kind = event.target.value

    this.setState({
      rescue
    })
  }

  saveBreed(event) {
    let {rescue} = this.state;

    rescue.breed = event.target.value

    this.setState({
      rescue
    })
  }

  saveAvailableFrom(date) {
    let {rescue} = this.state;

    let parsedDate = DateUtils.shiftPickerDate(date)
    rescue.available_from = parsedDate

    this.setState({
      rescue
    })
  }

  saveInfoUrl(event) {
    let {rescue} = this.state;

    rescue.info_url = event.target.value

    this.setState({
      rescue
    })
  }

  saveReceivingUser(event) {
    let {rescue} = this.state;

    rescue.receiving_user_email = event.target.value

    this.setState({
      rescue
    })
  }

  saveStatus(event) {
    let {rescue} = this.state;

    rescue.status = event.target.value

    this.setState({
      rescue
    })
  }

  saveFromAirports(event, newValue) {
    this.setState({
      selectedFromAirports: newValue
    })
  }

  saveToAirports(event, newValue) {
    this.setState({
      selectedToAirports: newValue
    })
  }

  renderMatchArea(){
    let {
      rescue,
      matches,
      rescueFlightMap,
    } = this.state

    let displayList = matches.map((flight, index) => {
      let rescueFlight = rescueFlightMap[flight.uuid]

      return (
        <FlightCard
          key={`flightcard-${index}`}
          flight={flight}
          rescue={rescue}
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

  onRescueFlightComplete(rescue_flight) {
    let {
      rescueFlightMap
    } = this.state

    rescueFlightMap[rescue_flight.flight_uuid] = rescue_flight

    this.setState({
      rescueFlightMap
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
            <h2>Flight Matches</h2>
            {matchArea}
          </Grid>
        </Grid>
      </div>
    )
  }
}

Rescue.propTypes = {
  rescueUuid: PropTypes.string
}

export default Rescue