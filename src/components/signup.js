import React, { Component } from 'react'
import { connect } from 'react-redux'
import { signup } from '../actions'

class Signup extends Component {

    state = {
        displayname: '',
        email: '',
        password: ''
    }

    updateState = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    signup = e => {
        e.preventDefault()
        this.props.signup({...this.state, history: this.props.history })
    }

    render() {
        return (
            <form onSubmit={this.signup} >
                <p>Display name</p>
                <input type="text" name="displayname" onChange={this.updateState} value={this.state.displayname} />
                <p>Email</p>
                <input type="text" name="email" onChange={this.updateState} value={this.state.email} />
                <p>Password</p>
                <input type="password" name="password" onChange={this.updateState} value={this.state.password} />
                <input type="submit" />
            </form>
        )
    }
}

export default connect(null, { signup })(Signup)