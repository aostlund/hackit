import React, { Component } from 'react'
import { connect } from 'react-redux'
import { EditorState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { updateEditorContent, saveEditedPost, sendError, getPost } from '../actions'

class NewPost extends Component {

    componentWillMount() {
        if (!this.props.user) {
            this.props.history.go(-1)
            this.props.sendError('You have to be logged in to post')
        }
        this.props.getPost(this.props.match.params.id)
    }

    updateText(contentState) {
        this.props.updateEditorContent({...this.props.content, content: contentState})
    }

    updateTitle(e) {
        this.props.updateEditorContent({...this.props.content, title: e.target.value })
    }

    updateLink(e) {
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
                    <div>
                        <p>Title</p>
                        <input type="text" onChange={this.updateTitle.bind(this)} value={this.props.content.title || post.title} />
                        <p>Link</p>
                        <input type="text" ref="link" onChange={this.updateLink.bind(this)} value={this.props.content.link || post.link} />
                        <Editor
                            initialContentState={post.content}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            onContentStateChange={this.updateText.bind(this)}
                        />
                        <button onClick={this.savePost.bind(this)}>Post</button>
                        <div dangerouslySetInnerHTML={{__html: this.html()}} />
                    </div>
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
        user: state.user,
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