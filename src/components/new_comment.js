import React, { Component } from 'react'
import { connect } from 'react-redux'
import { EditorState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { updateEditorContent, saveComment, sendError } from '../actions'

class NewComment extends Component {

    componentWillMount() {
        if (!this.props.user) {
            this.props.history.go(-1)
            this.props.sendError('You have to be logged in to comment')
        }
    }

    updateText(contentState) {
        this.props.updateEditorContent({...this.props.content, content: contentState, post: this.props.location.state.post, parent: this.props.location.state.parent })
    }

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
            <div>
                <Editor
                    initialContentState={this.props.content.content}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onContentStateChange={this.updateText.bind(this)}
                />
                <button onClick={this.saveComment.bind(this)}>Comment</button>
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
    saveComment,
    sendError
}

export default connect(mapStateToProps, mapDispatchToProps)(NewComment)