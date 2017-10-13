import { expect } from '../test_helper'
import postsReducer from '../../src/reducers/posts'
import {
    GET_POSTS,
    CHANGE_SCORE
} from '../../src/actions/types'

describe('PostsReducer', () => {
    it('handels action with unknown type', () => {
        expect(postsReducer(undefined, {})).to.be.instanceOf(Array)
    })
    it('handels action of type GET_POSTS', () => {
        const testArray = [{ title: 'Test', link: 'http://test.link', id: 0, type: 'video', score: 1 }]
        const action = { type: GET_POSTS, payload: testArray }
        expect(postsReducer([], action)).to.eql(testArray)
    })
    it('handels action of type CHANGE_SCORE', () => {
        const testArray = [{ title: 'Test', link: 'http://test.link', id: 0, type: 'video', score: 1 }]
        const action = { type: CHANGE_SCORE, payload: { id: 0, change: -1 }}
        expect(postsReducer(testArray, action)[0].score).to.eql(0)
    })
})