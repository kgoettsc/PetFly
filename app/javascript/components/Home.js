import React from 'react'
import { Typography, Button } from '@material-ui/core'
import { Link } from 'react-router-dom'

class Home extends React.Component {
  constructor(props){
    super(props)
  }

  render() {
    return (
      <div>
        <Typography
          component="h6">
          <Button
            size="small"
            component={Link}
            to="/orgPortal">
            Organization Portal
          </Button>
        </Typography>
        <Typography
          component="h6">
          <Button
            size="small"
            component={Link}
            to="/flights">
            See Flights
          </Button>
        </Typography>
        <Typography
          component="h6">
          <Button
            size="small"
            component={Link}
            to="/rescues">
            See Rescues
          </Button>
        </Typography>
      </div>
    )
  }
}

export default Home