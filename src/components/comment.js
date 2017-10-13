import React, { Component } from 'react'
import draftToHtml from 'draftjs-to-html'
import Vote from './vote'

export default class Comment extends Component {
    render() {
        return(
            <article key={this.props.id} >
                <div className="level is-marginless">
                    <div className="level-left">
                        <small>{this.props.userName}</small>
                    </div>
                    <div className="level-right">
                        <Vote {...this.props} />
                    </div>
                </div>
                <div className="container is-fluid" dangerouslySetInnerHTML={{__html: draftToHtml(JSON.parse(this.props.content)) }} />
            </article>
        )
    }
}