import React, { Component } from 'react'
import { connect } from 'react-redux'
import { EditorState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { updateEditorContent, savePost, sendError } from '../actions'

class NewPost extends Component {

    componentWillMount() {
        if (!this.props.user) {
            this.props.history.go(-1)
            this.props.sendError('You have to be logged in to post')
        }
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
        this.props.savePost({ content: this.props.content, history: this.props.history })
    }

    html() {
        if (this.props.content.content != {}) {
            return draftToHtml(this.props.content.content)
        }
    }

    render() {
        return (
            <div>
                <p>Title</p>
                <input type="text" onChange={this.updateTitle.bind(this)} value={this.props.content.title} />
                <p>Link</p>
                <input type="text" ref="link" onChange={this.updateLink.bind(this)} value={this.props.content.link} />
                <Editor
                    initialContentState={this.props.content.content}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onContentStateChange={this.updateText.bind(this)}
                />
                <button onClick={this.savePost.bind(this)}>Post</button>
                <div dangerouslySetInnerHTML={{__html: this.html()}} />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        content: state.editorContent,
        user: state.user
    }
}

const mapDispatchToProps = {
    updateEditorContent,
    savePost,
    sendError,
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPost)