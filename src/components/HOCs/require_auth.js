import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sendError } from '../../actions'

export default function(ComposedComponent) {
    class Authentication extends Component {
        componentWillMount() {
            console.log(this.props.user)
            if (!this.props.user) {
                this.props.history.go(-1)
                this.props.sendError('You have to be logged in to author content')
            }
        }

        componentWillUpdate(nextProps) {
            if (!nextProps.user) {
                this.props.history.push('/')
                this.props.sendError('You have to be logged in to author content')
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

    return connect(mapStateToProps, { sendError, })(Authentication)
}