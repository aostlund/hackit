import React, { Component } from 'react'
import { connect } from 'react-redux'
import { logoutUser } from '../actions'

class Logout extends Component {
    logoutUser = () => {
        this.props.logoutUser()
    }

    render() {
        return (
            <div className="nav-item">
                <button className="button is-danger" onClick={this.logoutUser}>Logout</button>
            </div>
        )
    }
}

export default connect(null, { logoutUser, })(Logout)