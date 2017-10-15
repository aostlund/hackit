import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAllUsers, toggleAdmin, deleteUser } from '../actions'

class Admin extends Component {

    componentWillMount() {
        this.props.getAllUsers()
    }

    deleteUser = user => this.props.deleteUser(user)

    toggleRole = user => this.props.toggleAdmin(user)

    render() {
        if (this.props.user && this.props.user.admin) {
            return (
                <div>
                    <table>
                        <thead>
                        <tr>
                            <td>DisplayName</td><td>Email</td><td>Admin</td>
                        </tr>
                        </thead>
                        <tbody>
                        { this.props.users.map(user => {
                            const deletable = user.uid === this.props.user.uid ? <td></td> : <td><a onClick={() => this.deleteUser(user)}>delete</a></td>;
                            return (
                            <tr>
                                <td>{ user.displayName }</td>
                                <td>{ user.email }</td>
                                <td><input type="checkbox" readOnly={true} checked={user.admin} onClick={() => {this.toggleRole(user)}} /></td>
                                {deletable}
                            </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            )
        } else {
            return <div/>
        }
    }
}

function mapStateToProps(state) {
    return {
        users: state.users,
        user: state.user
    }
}

export default connect(mapStateToProps, { getAllUsers, toggleAdmin, deleteUser })(Admin)