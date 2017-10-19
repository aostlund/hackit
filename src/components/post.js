import React from 'react'
import {
    Link
} from 'react-router-dom'
import Vote from './vote'

export default (props) => {
    return (
            <article className="media">
                <figure className="media-left">
                </figure>
                <div className="media-content">
                    <a className="title is-4 has-text-primary" href={props.link ? props.link : `/comments/${props.id}`}>
                        {props.title} 
                        <small className="has-text-grey is-6">{`(${props.link ? new URL(props.link).hostname : 'self'})`}</small>
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