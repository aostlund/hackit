import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRoute as Router, Route, Link } from 'react-router-dom'
import Login from './login'
import Logout from './logout'
import Signup from './signup'

class Header extends Component {

    loggedIn = () => {
        if (this.props.user) {
            return (
                <div className="nav-right">
                    { this.isAdmin() }
                    <Link className="nav-item" to="/newpost" >Post</Link>
                    <div className="nav-item">
                        <h6 className="is-6">{this.props.user.displayName}</h6>
                    </div>
                    <Logout/>
                </div>
            )
        }
        return (
                <div className="nav-right">
                    <Login error={this.props.error} />
                    <div className="nav-item">
                    <Signup error={this.props.error} />
                    </div>
                </div>
        )
    }

    showError = () => {
        if (this.props.error) {
            return (
                <span className="tag is-danger is-small">
                    <p className="is-size-6">{this.props.error}</p>
                </span>
            )
        }
    }

    isAdmin = () => {
        if (this.props.user && this.props.user.admin) {
            return (
                <Link className="nav-item" to="/admin" >Admin</Link>
            )
        }
    }

    render() {
        return(
            <div className="box">
                <nav className="nav">
                    <div className="nav-left">
                        <a href="/" className="nav-item">
                            <h1 className="title is-1 has-text-grey">Hackit</h1>
                        </a>
                    </div>
                    { this.loggedIn() }
                </nav>
                { this.showError() }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        error: state.error
    }
}

export default connect(mapStateToProps)(Header)