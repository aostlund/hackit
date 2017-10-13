import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sendError } from '../actions'

class Vote extends Component {
    increaseScore() {
        if (this.props.user) {
            this.props.changeScore({id: this.props.id, change: 1})
        } else {
            this.props.sendError('You must be logged in to vote')
        }
    }

    decreaseScore() {
        if (this.props.user) {
            this.props.changeScore({id: this.props.id, change: -1})
        } else {
            this.props.sendError('You must be logged in to vote')
        }
    }

    render() {
        return (
            <p>
                Points: <strong>{this.props.score}</strong> 
                <span className="icon has-text-primary">
                    <i className="fa fa-thumbs-up" onClick={() => this.increaseScore() }></i>
                </span>
                <span className="icon has-text-danger">
                    <i className="fa fa-thumbs-down" onClick={this.decreaseScore.bind(this)}></i>
                </span>
            </p>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, { sendError })(Vote)