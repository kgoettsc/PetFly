import React from 'react'

import { Grid, Button } from '@material-ui/core';

class RescueList extends React.Component {
  constructor(props) {
    super(props)

    this.getRescues()

    this.state = {
      rescues: []
    }
  }

  getRescues(){
    $.ajax({
      url: '/rescues/active',
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
          <Button
            size="small"
            component={Link}
            to={"/rescue/" + rescue.uuid} >
            {animal.name} - ({organization.name})
          </Button>
        </span>
      )
    })

    return displayList
  }

  render() {
    let rescueList = this.renderRescueCards()

    return (
      <div>
        This is where you see a list of Rescues
        <Grid
          container
          spacing={3} >
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

export default RescueList