import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loginUser, signupGoogle } from '../actions'

class Login extends Component {

    state = {
        email: '',
        password: '',
        modal: false
    }

    loginUser = e => {
        e.preventDefault()
        this.props.loginUser({ email: this.state.email, password: this.state.password })
    }

    updateState = e => {
        this.setState({[e.target.name]: e.target.value})
    }

    toggleModal = () => {
        this.setState({ modal: !this.state.modal })
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

    render() {
        return (
            <div className="nav-item">
                <button className="button" onClick={this.toggleModal}>Login</button>
                <div className={`modal ${this.state.modal ? 'is-active' : ''}`} style={{textAlign: 'left !important'}}>
                    <div onClick={this.toggleModal} className="modal-background"></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Login</p>
                            <button onClick={this.toggleModal} className="delete" ariaLabel="close"></button>
                        </header>
                        <section className="modal-card-body">
                            { this.showError() }
                            <form onSubmit={this.loginUser} >
                                <div className="field">
                                    <label className="label">E-mail</label>
                                    <div className="control">
                                        <input className="input" type="text" name="email" onChange={this.updateState} value={this.state.email} placeholder="email@host.com"/>
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label">Password</label>
                                    <div className="control">
                                        <input className="input" type="password" name="password" onChange={this.updateState} value={this.state.password} />
                                    </div>
                                </div>
                                <div className="field">
                                    <div className="control">
                                        <input className="button is-primary" type="submit" />
                                    </div>
                                </div>
                            </form>
                            <button className="button" style={{margin: "1rem 0"}} onClick={this.props.signupGoogle}>Login with Google</button>
                        </section>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(null, { loginUser, signupGoogle })(Login)