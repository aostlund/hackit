import React, { Component } from 'react'
import { connect } from 'react-redux'

class Admin extends Component {

    render() {
        return (
            <div>Admin</div>
        )
    }
}

export default connect()(Admin)