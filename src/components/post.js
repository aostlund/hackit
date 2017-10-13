import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'
import Vote from './vote'

export default (props) => {
    return (
            <article className="media">
                <figure className="media-left">
                    <p className="image is-64x64">
                        <img src="https://placekitten.com/g/64/64" />
                    </p>
                </figure>
                <div className="media-content">
                    <a className="title is-4 has-text-primary" href={props.link ? `http://${props.link}` : `/comments/${props.id}`}>
                        {props.title} 
                        <small className="has-text-grey is-6">{`  (${props.link || 'self'})`}</small>
                    </a>
                    <p><small>submitted by </small><strong>{props.userName}</strong></p>
                    {props.html ? <div dangerouslySetInnerHTML={{__html: props.html}} /> : ''}
                </div>
                <div className="media-right">
                    <strong>{props.comments} </strong>
                    <Link to={'/comments/'+props.id}>{props.comments == 1 ? 'Comment' : 'Comments'}</Link>
                    <Vote {...props} />
                </div>
            </article>
    )
}