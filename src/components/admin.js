import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAllUsers, toggleAdmin, deleteUser, sendError } from '../actions'

class Admin extends Component {

    componentWillMount() {
        this.props.getAllUsers()
    }

    deleteUser = user => this.props.deleteUser(user)

    toggleRole = user => this.props.toggleAdmin(user)

    render() {
        return (
            <article className="box">
                <table className="table is-striped is-bordered">
                    <thead>
                    <tr>
                        <td>DisplayName</td><td>Email</td><td>Admin</td><td>Delete</td>
                    </tr>
                    </thead>
                    <tbody>
                    { this.props.users.map(user => {
                        const deletable = user.uid === this.props.user.uid ? <td></td> : <td><a onClick={() => this.deleteUser(user)}>delete</a></td>;
                        if (!user.delete) {
                            return (
                                <tr>
                                    <td>{ user.displayName }</td>
                                    <td>{ user.email }</td>
                                    <td style={{textAlign: 'center'}}><input type="checkbox" readOnly={true} checked={user.admin} onClick={() => {this.toggleRole(user)}} /></td>
                                    {deletable}
                                </tr>
                            )
                        }
                    })}
                    </tbody>
                </table>
            </article>
        )
    }
}

function mapStateToProps(state) {
    return {
        users: state.users,
    }
}

const mapDispatchToProps = {
    getAllUsers,
    toggleAdmin,
    deleteUser,
    sendError
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin)