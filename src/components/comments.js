import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getComments, changeCommentScore, getChildComments, changePostScore, getPost, cancelCommentsChannel, deletePost, deleteComment, cancelPostChannel } from '../actions'
import { Route, Link } from 'react-router-dom'
import draftToHtml from 'draftjs-to-html'
import Comment from './comment'
import Vote from './vote'

class Comments extends Component {
    componentWillMount() {
        this.props.cancelPostChannel() // Cancel channel so we listen to the rigth post
        this.props.getPost(this.props.match.params.id)
        this.props.cancelCommentsChannel()
        this.props.getComments({ id: this.props.match.params.id })
    }

    html(post) {
        if (post.content != {}) {
            return draftToHtml(JSON.parse(post.content))
        }
    }

    // Does current User have rights to Edit comment or post. 
    canEdit = (target, path) => {
        if (this.props.user && (this.props.user.uid === target.user || this.props.user.admin)) {
            return(
                <Link to={`/${path}/${target.id}`} >Edit</Link>
            )
        }
    }

    // Does current User have rights to Delete comment or post. 
    canDelete = (target, type) => {
        if (this.props.user && this.props.user.admin) {
            if (type === 'post') {
                return <a onClick={() => this.props.deletePost({ ...target, history: this.props.history })}>Delete</a>
            } else {
                return <a onClick={() => this.props.deleteComment(target)}>Delete</a>
            }
        }
    }

    // Lists comments with comment as a parent
    listChildComments(id) {
        const list = this.props.comments.filter(a => a.parent === id)
        if (list.length > 0) {
            return list.sort((a,b) => a.score < b.score ? 1 : -1)
                .map(comment => {
                    return (
                        <div key={comment.id} className="media" style={{ border: 'solid lightgrey 1px'}}>
                            <div className="media-left" />
                            <div className="media-content">
                                <Comment {...comment} changeScore={this.props.changeScore} />
                                <Link to={{
                                    pathname: '/newcomment',
                                    state: {
                                        post: this.props.post.posts[0].id,
                                        parent: comment.id
                                    }
                                }} >Reply</Link>
                                <span>  </span>
                                {this.canEdit(comment, 'editcomment')}
                                <span> </span>
                                {this.canDelete(comment, 'comment')}
                                {this.listChildComments(comment.id)}
                            </div>
                        </div>
                    )
                })
        }
        return undefined
    }

    // Lists comments that has no comment as a parent
    listComments() {
        const list = this.props.comments.filter(a => a.parent === 0)
        return list.sort((a,b) => a.score < b.score ? 1 : -1)
            .map(comment => {
                return (
                    <article key={comment.id} className="media" style={{ border: 'solid lightgrey 1px'}}>
                        <div className="media-left" />
                        <div className="media-content">
                            <Comment {...comment} changeScore={this.props.changeScore} />
                            <Link to={{
                                pathname: '/newcomment',
                                state: {
                                    post: this.props.post.posts[0].id,
                                    parent: comment.id
                                }
                            }} >Reply</Link>
                            <span>  </span>
                            {this.canEdit(comment, 'editcomment')}
                            <span> </span>
                            {this.canDelete(comment, 'comment')}
                            {this.listChildComments(comment.id)}
                        </div>
                    </article>
                )
            })
    }

    render() {
        if (this.props.post.posts) {
            if (this.props.post.posts.length === 1) {
                let post = this.props.post.posts[0]
                return (
                    <div className="box">
                        <article className="media">
                            <figure className="media-left">
                            </figure>
                            <div className="media-content">
                                <a className="title is-3" href={post.link}>
                                    {post.title}
                                </a>
                                <p><small>submitted by </small><strong>{post.userName}</strong></p>
                                <div className="comment" dangerouslySetInnerHTML={{__html: this.html(post)}} />
                                <div className="level is-mobile">
                                    <span>
                                        <Link to={{
                                                pathname: '/newcomment',
                                                state: {
                                                    post: post.id,
                                                    parent: 0
                                                }
                                            }} >Reply</Link>  
                                        <span> </span>
                                        {this.canEdit(post, 'editpost')}
                                        <span> </span>
                                        {this.canDelete(post, 'post')}
                                    </span>
                                    <Vote {...post} changeScore={this.props.changePostScore} />
                                </div>
                                {this.listComments()}
                            </div>
                        </article>
                    </div>
                )
            } else {
                return <div/>
            }
        } else {
            return <div/>
        }
    }
}

function mapStateToProps(state) {
    return {
        post: state.posts,
        comments: state.comments,
        user: state.user
    }
}

const mapDispatchToProps = {
    getPost,
    getComments,
    cancelCommentsChannel,
    changePostScore: changePostScore,
    changeScore: changeCommentScore,
    deletePost,
    deleteComment,
    cancelPostChannel
}

export default connect(mapStateToProps, mapDispatchToProps)(Comments)