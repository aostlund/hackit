import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sendError } from '../actions'

export default (props) => {
    return (
        <p>
            Points: <strong>{props.score}</strong> 
            <span className="icon has-text-primary">
                <i className="fa fa-thumbs-up" onClick={ () => props.changeScore({ id: props.id, change: 1}) }></i>
            </span>
            <span className="icon has-text-danger">
                <i className="fa fa-thumbs-down" onClick={ () => props.changeScore({ id: props.id, change: -1}) }></i>
            </span>
        </p>
    )
}