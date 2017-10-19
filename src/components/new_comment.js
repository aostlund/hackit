import React, { Component } from 'react'
import { connect } from 'react-redux'
import { EditorState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { updateEditorContent, saveComment, sendError } from '../actions'

class NewComment extends Component {

    updateText(contentState) {
        this.props.updateEditorContent({...this.props.content, content: contentState, post: this.props.location.state.post, parent: this.props.location.state.parent })
    }

    // Saves comment
    saveComment() {
        this.props.saveComment({ content: this.props.content, history: this.props.history })
    }

    html() {
        if (this.props.content.content != {}) {
            return draftToHtml(this.props.content.content)
        }
    }

    render() {
        return (
            <article className="box">
                <Editor
                    initialContentState={this.props.content.content}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onContentStateChange={this.updateText.bind(this)}
                />
                <button className="button is-primary" onClick={this.saveComment.bind(this)}>Comment</button>
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
    saveComment,
    sendError
}

export default connect(mapStateToProps, mapDispatchToProps)(NewComment)