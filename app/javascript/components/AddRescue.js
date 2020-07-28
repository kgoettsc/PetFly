import React from 'react'
import { TextField, IconButton, Select, MenuItem } from '@material-ui/core'

import SaveIcon from '@material-ui/icons/Save';

import * as ApiUtils from '../packs/apiUtils.js'

class AddRescue extends React.Component {
  constructor(props) {
    super(props)

    this.getOrganizations()

    this.state = {
      rescue: {
        uuid: "",
        name: "",
        kind: "",
        breed: "",
        info_url: "",
        organization_uuid: "",
        receiving_user_uuid: ""
      },
      isSaving: false,
      organizations: []
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

  saveRescue() {
    this.setState({
      isSaving: true
    })

    let {
      rescue
    } = this.state

    let params = {
      "name": rescue.name,
      "kind": rescue.kind,
      "breed": rescue.breed,
      "info_url": rescue.info_url,
      "organization_uuid": rescue.organization_uuid,
      "receiving_user_uuid": rescue.receiving_user_uuid,
    }

    $.ajax({
      url: `/rescues`,
      method: 'POST',
      data: JSON.stringify(params),
      contentType: 'application/json',
      headers: {
        'X-CSRF-Token': ApiUtils.getCsrfToken(document),
      },
      success: (data) => {
        let {rescue} = data
        console.log(`saved the country for ${rescue.uuid}`)

        this.setState({
          isSaving: false,
          rescue
        })
      },
      error: (data) => {
        console.log("error for countries")
        this.setState({
          isSaving: false
        })
      }
    });
  }

  renderEditArea() {
    let {
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
        <Select
          value={rescue.organization_uuid}
          onChange={this.saveOrg.bind(this)}
          label='Organization'>
          {orgSelects}
        </Select>
        <TextField
          required
          onChange={this.saveName.bind(this)}
          label='Name'
          style={{width: '300px'}}
          value={rescue.name}/>
        <Select
          value={rescue.kind}
          onChange={this.saveKind.bind(this)}
          label='Kind'>
          <MenuItem value='dog'>Dog</MenuItem>
          <MenuItem value='cat'>Cat</MenuItem>
          <MenuItem value='balrog'>Balrog</MenuItem>
        </Select>
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


  render() {
    let {
      isSaving
    } = this.state

    let editArea = this.renderEditArea()

    return (
      <div>
        Add the rescue here!
        <IconButton
          size='small'
          disabled={isSaving}
          onClick={this.saveRescue.bind(this)}>
          <SaveIcon
            fontSize='small'/>
        </IconButton>
        {editArea}
      </div>
    )
  }
}

export default AddRescue