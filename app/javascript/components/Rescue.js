import React from 'react'
import PropTypes from "prop-types"

class Rescue extends React.Component {

  constructor(props) {
    super(props)

    this.getRescue();

    this.state = {
      rescue: {
        animal: {},
        organization: {}
      }
    }
  }

  getRescue() {
    let {
      rescueUuid
    } = this.props

    $.ajax({
      url: `/rescues/${rescueUuid}`,
      method: 'GET',
      contentType: 'application/json',
      success: (data) => {
        console.log("got the rescue!")
        let {rescue} = data

        this.setState({
          rescue
        })
      },
      error: (data) => {
        console.log("error for rescue")
      }
    });
  }

  renderDisplayArea() {
    let {
      rescue
    } = this.state

    if (!rescue.animal || !rescue.animal.name) {
      return null
    }

    let {
      animal,
      organization
    } = rescue

    return (
      <span>
        {animal.name} from {organization.name}
      </span>
    )
  }

  render() {
    let displayArea = this.renderDisplayArea()
    return (
      <div>
        {displayArea}
      </div>
    )
  }
}

Rescue.propTypes = {
  rescueUuid: PropTypes.string
}

export default Rescue