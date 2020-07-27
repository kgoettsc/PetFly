import React from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom";

import { Button, Typography } from "@material-ui/core";

class HomeContainer extends React.Component {
  constructor(props){
    super(props)

    this.getUser()

    this.state = {
      user: {},
    }
  }

  getUser() {
    $.ajax({
      url: '/user_auths',
      method: 'GET',
      contentType: 'application/json',
      success: (data) => {
        let {user} = data

        this.setState({
          user
        })
      },
      error: (data) => {
        console.log("error for user")
      }
    });
  }

  render() {
    let {
      user
    } = this.state

    return (
      <div>
        <Typography
          variant="h2">
          <Button
            size="small"
            component={Link}
            to="/">
            PetFly
          </Button>
        </Typography>
        <span>Welcome {user.full_name}</span>
        <br/>
        {this.props.children}
      </div>
    );
  }
}

HomeContainer.propTypes = {
  children: PropTypes.array.isRequired
};

export default HomeContainer;