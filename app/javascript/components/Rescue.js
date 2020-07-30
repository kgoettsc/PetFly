import React from 'react'
import PropTypes from "prop-types"

import _ from 'lodash'

import { TextField, IconButton, Select, MenuItem, Typography, FormControl, InputLabel, Grid } from '@material-ui/core'

import { Save, Edit, Cancel } from '@material-ui/icons';

import * as ApiUtils from '../packs/apiUtils.js'

class Rescue extends React.Component {
  constructor(props) {
    super(props)

    let {
      rescueUuid
    } = props

    this.getOrganizations()
    this.getAirports()
    this.getRescue()

    this.state = {
      rescue: {
        uuid: "",
        name: "",
        kind: "",
        breed: "",
        status: "active",
        info_url: "",
        organization_uuid: "",
        organization_name: "",
        receiving_user_uuid: ""
      },
      isSaving: false,
      organizations: [],
      airports: [],
      editMode: !rescueUuid
    }
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

        this.setState({
          airports
        })
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

        this.setState({
          rescue,
          editMode: false
        })
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
      rescue
    } = this.state

    let url = rescue.uuid ? `/rescues/${rescue.uuid}` : '/rescues'
    let method = rescue.uuid ? `PUT` : 'POST'

    let params = {
      "name": rescue.name,
      "kind": rescue.kind,
      "breed": rescue.breed,
      "status": rescue.status,
      "info_url": rescue.info_url,
      "organization_uuid": rescue.organization_uuid,
      "receiving_user_uuid": rescue.receiving_user_uuid,
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

    rescue.uuid = rescueData.uuid
    rescue.name = rescueData.animal.name
    rescue.kind = rescueData.animal.kind
    rescue.breed = rescueData.animal.breed
    rescue.status = rescueData.status
    rescue.info_url = rescueData.animal.info_url
    rescue.organization_uuid = rescueData.organization.uuid
    rescue.organization_name = rescueData.organization.name

    return rescue
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
      rescue
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
        {rescue.info_url &&
          <Typography
            variant='h5'>
            <a
              href={rescue.info_url} >
            Link to Rescue
            </a>
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
      isSaving,
      rescue,
      organizations
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
        <TextField
          required
          onChange={this.saveInfoUrl.bind(this)}
          label='Info URL'
          style={{width: '300px'}}
          value={rescue.info_url}/>
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

  saveInfoUrl(event) {
    let {rescue} = this.state;

    rescue.info_url = event.target.value

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

  render() {
    let editArea = this.renderArea()

    return (
      <div>
        <Grid
          container
          spacing={3} >
          <Grid
            item
            xs={6} >
            {editArea}
          </Grid>
          <Grid
            item
            xs={6} >
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