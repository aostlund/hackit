import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getComments, changeCommentScore, getChildComments, changePostScore, getPost, cancelCommentsChannel, deletePost, deleteComment, cancelPostChannel } from '../actions'
import { Route, Link } from 'react-router-dom'
import draftToHtml from 'draftjs-to-html'
import Comment from './comment'
import Vote from './vote'

class Comments extends Component {
    componentWillMount() {
        this.props.cancelPostChannel()
        this.props.getPost(this.props.match.params.id)
        if (this.props.comments.length != 0) {
            this.props.cancelCommentsChannel()
        }
        this.props.getComments({ id: this.props.match.params.id })
    }

    componentDidMount() {
        this.props.getComments({ id: this.props.match.params.id })
    }

    html(post) {
        if (post.content != {}) {
            return draftToHtml(post.content)
        }
    }

    canEdit = (target, path) => {
        if (this.props.user && (this.props.user.uid === target.user || this.props.user.admin)) {
            return(
                <Link to={`/${path}/${target.id}`} >Edit</Link>
            )
        }
    }

    canDelete = (target, type) => {
        if (this.props.user && this.props.user.admin) {
            if (type === 'post') {
                return <a onClick={() => this.props.deletePost({ ...target, history: this.props.history })}>Delete</a>
            } else {
                return <a onClick={() => this.props.deleteComment(target)}>Delete</a>
            }
        }
    }

    listChildComments(id) {
        const list = this.props.comments.filter(a => a.parent === id)
        if (list.length > 0) {
            return list.sort((a,b) => a.score < b.score ? 1 : -1)
                .map(comment => {
                    return (
                        <div className="media" style={{ borderLeft: 'solid lightgrey 1px'}}>
                            <div className="media-left" />
                            <div className="media-content">
                                <Comment {...comment} changeScore={this.props.changeScore} />
                                <Link to={{
                                    pathname: '/newcomment',
                                    state: {
                                        post: this.props.post.id,
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

    listComments() {
        const list = this.props.comments.filter(a => a.parent === 0)
        return list.sort((a,b) => a.score < b.score ? 1 : -1)
            .map(comment => {
                return (
                    <article className="media" style={{ borderLeft: 'solid lightgrey 1px'}}>
                        <div className="media-left" />
                        <div className="media-content">
                            <Comment {...comment} changeScore={this.props.changeScore} />
                            <Link to={{
                                pathname: '/newcomment',
                                state: {
                                    post: this.props.post.id,
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
                                <p className="image is-64x64">
                                    <img src="https://placekitten.com/g/64/64" />
                                </p>
                            </figure>
                            <div className="media-content">
                                <a className="title is-3" href={post.link}>
                                    {post.title}
                                </a>
                                <p><small>submitted by </small><strong>{this.props.post.userName}</strong></p>
                                <div dangerouslySetInnerHTML={{__html: this.html(post)}} />
                                <div className="level">
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