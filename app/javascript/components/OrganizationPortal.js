import React from 'react'
import { Grid } from '@material-ui/core';

class OrganizationPortal extends React.Component {
  constructor(props) {
    super(props)

    this.getOrganizations()
    this.getRescues()

    this.state = {
      organizations: [],
      rescues: []
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
        console.log("error for orgs")
      }
    });
  }

  getRescues(){
    $.ajax({
      url: '/rescues/active_by_user',
      method: 'GET',
      contentType: 'application/json',
      success: (data) => {
        console.log("got rescues!")
        let {rescues} = data

        this.setState({
          rescues
        })
      },
      error: (data) => {
        console.log("error for rescues")
      }
    });
  }

  renderOrgCards() {
    let {
      organizations
    } = this.state

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

  renderRescueCards() {
    let {
      rescues
    } = this.state

    let displayList = rescues.map((rescue, index) => {
      let {
        animal,
        organization
      } = rescue

      return (
        <span
          key={`rescues-${index}`}>
          {animal.name} - ({organization.name})
        </span>
      )
    })

    return displayList
  }

  render() {
    let orgList = this.renderOrgCards()
    let rescueList = this.renderRescueCards()

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
            {rescueList}
          </Grid>
        </Grid>
      </div>
    )
  }

}

export default OrganizationPortal