import React, { Component } from 'react'
import { connect } from 'react-redux'
import { EditorState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { updateEditorContent, saveEditedPost, sendError, getPost } from '../actions'

class NewPost extends Component {

    componentWillMount() {
        this.props.getPost(this.props.match.params.id)
    }

    updateText(contentState) {
        this.props.updateEditorContent({...this.props.content, content: contentState})
    }

    updateTitle = (e) => {
        this.props.updateEditorContent({...this.props.content, title: e.target.value })
    }

    updateLink = (e) => {
        this.props.updateEditorContent({...this.props.content, link: e.target.value })
    }

    savePost() {
        if (!this.props.content) {
            this.props.sendError('You have not changed anything')
        } else {
            if (typeof this.props.content.content === "string") {
                this.props.content.content = this.props.post.content
            }
            this.props.saveEditedPost({ content: this.props.content, history: this.props.history, id: this.props.match.params.id })
        }
    }

    html() {
        if (this.props.content.content != {}) {
            return draftToHtml(this.props.content.content)
        }
    }

    render() {
        if (this.props.post.posts && this.props.post.posts.length === 1) {
            let post = this.props.post.posts[0]
            if (this.props.user.uid === post.user) {
                return (
                    <article className="box">
                        <div className="field">
                            <label className="label">Title</label>
                            <div className="control">
                                <input className="input" type="text" name="title" onChange={this.updateTitle} value={this.props.content.title || post.title} />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Link</label>
                            <div className="control">
                                <input className="input" type="text" name="link" onChange={this.updateLink} value={this.props.content.link || post.link} />
                            </div>
                        </div>
                        <Editor
                            initialContentState={post.content}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            onContentStateChange={this.updateText.bind(this)}
                        />
                        <button className="button is-primary" onClick={this.savePost.bind(this)}>Post</button>
                    </article>
                )
            } else {
                this.props.sendError('You can not edit another users post')
                this.props.history.go(-1)
            }
        } else {
            return <div/>
        }
    }
}

function mapStateToProps(state) {
    return {
        content: state.editorContent,
        post: state.posts
    }
}

const mapDispatchToProps = {
    updateEditorContent,
    saveEditedPost,
    sendError,
    getPost,
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPost)