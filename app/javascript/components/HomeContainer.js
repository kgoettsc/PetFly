import React from "react"
import PropTypes from "prop-types"

class HomeContainer extends React.Component {
  constructor(props){
    super(props)

    // this.getUser()

    this.state = {
      user: {},
    }
  }

  // getUser() {
  //   $.ajax({
  //     url: '/user_auths',
  //     method: 'GET',
  //     contentType: 'application/json',
  //     success: (data) => {
  //       let {user} = data

  //       this.setState({
  //         user
  //       })
  //     },
  //     error: (data) => {
  //       console.log("error for user")
  //     }
  //   });
  // }

  render() {
    // let {
    //   user
    // } = this.state
    console.log("home container")

    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

HomeContainer.propTypes = {
  children: PropTypes.array.isRequired
};

export default HomeContainer;