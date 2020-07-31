import React from 'react'

import { Grid, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

class RescueList extends React.Component {
  constructor(props) {
    super(props)

    this.getRescues()
    this.getReceivingRescues()

    this.state = {
      rescues: [],
      receivingRescues: [],
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

  getReceivingRescues(){
    $.ajax({
      url: '/rescues/active_by_receiving_user',
      method: 'GET',
      contentType: 'application/json',
      success: (data) => {
        console.log("got receiving rescues!")
        let {rescues} = data

        this.setState({
          receivingRescues: rescues
        })
      },
      error: (data) => {
        console.log("error for receiving rescues")
      }
    });
  }

  renderRescueCards() {
    let {
      rescues
    } = this.state

    return this.renderDisplayCards(rescues)
  }

  renderReceivingRescueCards() {
    let {
      receivingRescues
    } = this.state

    return this.renderDisplayCards(receivingRescues)
  }

  renderDisplayCards(rescues) {
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
    let receivingRescueList = this.renderReceivingRescueCards()

    return (
      <div>
        <Grid
          container
          spacing={3} >
          <Grid
            item
            xs={6} >
            <h2>All Active Rescues</h2>
            {rescueList}
          </Grid>
          <Grid
            item
            xs={6} >
            <h2>Your Rescues you are Receiving</h2>
            {receivingRescueList}
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default RescueList