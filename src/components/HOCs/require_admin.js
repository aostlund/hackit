import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sendError } from '../../actions'

export default function(ComposedComponent) {
    class AdminAuth extends Component {
        componentWillMount() {
            if (!this.props.user || !this.props.user.admin) {
                this.props.history.go(-1)
                this.props.sendError('You have to be admin to access admin-page')
            }
        }

        componentWillUpdate(nextProps) {
            if (!nextProps.user || !this.props.user.admin) {
                this.props.history.push('/')
                this.props.sendError('You have to be admin to access admin-page')
            }
        }

        render() {
            return <ComposedComponent {...this.props} />
        }
    }

    const mapStateToProps = state => {
        return {
            user: state.user
        }
    }

    return connect(mapStateToProps, { sendError, })(AdminAuth)
}