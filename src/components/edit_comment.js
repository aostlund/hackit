import React, { Component } from 'react'
import { connect } from 'react-redux'
import { EditorState, convertFromRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { updateEditorContent, saveEditedComment, sendError, getComment } from '../actions'

class EditComment extends Component {

    componentWillMount() {
        if (!this.props.user) {
            this.props.history.go(-1)
            this.props.sendError('You have to be logged in to edit this comment')
        }
        this.props.getComment(this.props.match.params.id)
    }

    updateText(contentState) {
        this.props.updateEditorContent({...this.props.content, content: contentState})
    }

    saveComment() {
        if (!this.props.content.content) {
            this.props.sendError('You have not typed anything new')
        } else {
            this.props.saveEditedComment({ content: this.props.content, history: this.props.history, id: this.props.match.params.id })
        }
    }

    html() {
        if (this.props.comment.content) {
            return draftToHtml(JSON.parse(this.props.comment.content))
        }
    }

    showEditor = () => {
        if (this.props.comment.content && this.props.match.params.id === this.props.comment.id) {
            if (this.props.user.uid === this.props.comment.user) {
                return (
                    <Editor
                        initialContentState={JSON.parse(this.props.comment.content)}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                        onContentStateChange={this.updateText.bind(this)}
                    />
                )
            } else {
                this.props.sendError('You cannot edit another users comment')
                this.props.history.go(-1)
            }
        }
    }

    render() {
        return (
            <article className="box">
                {this.showEditor()}
                <button className="button is-primary" onClick={this.saveComment.bind(this)}>Comment</button>
            </article>
        )
    }
}

function mapStateToProps(state) {
    return {
        content: state.editorContent,
        user: state.user,
        comment: state.comments[0] || {}
    }
}

const mapDispatchToProps = {
    updateEditorContent,
    saveEditedComment,
    sendError,
    getComment
}

export default connect(mapStateToProps, mapDispatchToProps)(EditComment)