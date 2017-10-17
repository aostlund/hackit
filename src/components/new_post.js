import React, { Component } from 'react'
import { connect } from 'react-redux'
import { EditorState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { updateEditorContent, savePost, sendError } from '../actions'

class NewPost extends Component {

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
        this.props.savePost({ content: this.props.content, history: this.props.history })
    }

    html() {
        if (this.props.content.content != {}) {
            return draftToHtml(this.props.content.content)
        }
    }

    render() {
        return (
            <article className="box">
                <div className="field">
                    <label className="label">Title</label>
                    <div className="control">
                        <input className="input" type="text" name="title" onChange={this.updateTitle} value={this.props.content.title} />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Link</label>
                    <div className="control">
                        <input className="input" type="text" name="link" onChange={this.updateLink} value={this.props.content.link} />
                    </div>
                </div>
                <Editor
                    initialContentState={this.props.content.content}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onContentStateChange={this.updateText.bind(this)}
                />
                <button className="button is-primary" onClick={this.savePost.bind(this)}>Post</button>
            </article>
        )
    }
}

function mapStateToProps(state) {
    return {
        content: state.editorContent,
    }
}

const mapDispatchToProps = {
    updateEditorContent,
    savePost,
    sendError,
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPost)