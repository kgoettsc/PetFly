import React from 'react'
import { Grid } from '@material-ui/core';

class OrganizationPortal extends React.Component {
  constructor(props) {
    super(props)

    this.getOrganizations()

    this.state = {
      organizations: []
    }
  }

  getOrganizations(){
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
        console.log("error for user")
      }
    });
  }

  renderOrgCards() {
    let {
      organizations
    } = this.state
    console.log("render org cards")
    let displayList = organizations.map((organization, index) => {
      return (
        <span
          key={`orgName-${index}`}>
          {organization.name}
        </span>
      )
    })


    return displayList
  }

  render() {
    let orgList = this.renderOrgCards()

    return (
      <div>
        This is where you do all the Org actions2
        <Grid
          container
          spacing={3} >
          <Grid
            item
            xs={6} >
            {orgList}
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

export default OrganizationPortal