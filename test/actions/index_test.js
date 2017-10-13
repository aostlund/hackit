import { expect } from '../test_helper'
import {
    GET_POSTS,
    CHANGE_POST_SCORE,
    GET_COMMENTS,
    CHANGE_COMMENT_SCORE,
    UPDATE_EDITOR_CONTENT
} from '../../src/actions/types'
import {
    getPosts,
    changePostScore,
    getComments,
    changeCommentScore,
    updateEditorContent
} from '../../src/actions'

describe('Actions', () => {
    describe('getPosts', () => {
        it('has the correct type', () => {
            const action = getPosts()
            expect(action.type).to.equal(GET_POSTS)
        })
        it('has the correct payload "type"', () => {
            const action = getPosts()
            expect(action.payload).to.be.instanceOf(Array)
        })
    })
    describe('changePostScore', () => {
        it('has the correct type', () => {
            const action = changePostScore({ id: 0, change: 0 })
            expect(action.type).to.equal(CHANGE_POST_SCORE)
        })
        it('has the correct payload', () => {
            const action = changePostScore({ id: 0, change: -1 })
            expect(action.payload).to.eql({ id: 0, change: -1 })
        })
    })
    describe('getComments', () => {
        it('has the correct type', () => {
            const action = getComments({})
            expect(action.type).to.equal(GET_COMMENTS)
        })
        it('has the correct payload "type"', () => {
            const action = getComments({id: 0})
            expect(action.payload).to.be.instanceOf(Array)
        })
    })
    describe('changeCommentScore', () => {
        it('has the correct type', () => {
            const action = changeCommentScore({ id: 0, change: 0 })
            expect(action.type).to.equal(CHANGE_COMMENT_SCORE)
        })
        it('has the correct payload', () => {
            const action = changeCommentScore({ id: 0, change: -1 })
            expect(action.payload).to.eql({ id: 0, change: -1 })
        })
    })
    describe('updateEditorContent', () => {
        it('has the correct type', () => {
            const action = updateEditorContent({ test: 'test' })
            expect(action.type).to.equal(UPDATE_EDITOR_CONTENT)
        })
        it('has the correct payload', () => {
            const action = updateEditorContent({ test: 'test' })
            expect(action.payload).to.eql({ test: 'test' })
        })
    })
})