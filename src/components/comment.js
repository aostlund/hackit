import React, { Component } from 'react'
import draftToHtml from 'draftjs-to-html'
import Vote from './vote'

export default (props) => {
        return(
            <article key={props.id} >
                <div className="level is-marginless">
                    <div className="level-left">
                        <small>{props.userName}</small>
                    </div>
                    <div className="level-right">
                        <Vote {...props} />
                    </div>
                </div>
                <div className="container is-fluid" dangerouslySetInnerHTML={{__html: draftToHtml(JSON.parse(props.content)) }} />
            </article>
        )
}