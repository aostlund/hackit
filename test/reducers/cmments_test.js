import { expect } from '../test_helper'
import commentsReducer from '../../src/reducers/comments'
import {
    GET_COMMENTS
} from '../../src/actions/types'

describe('CommentsReducer', () => {
    it('handels action with unknown type', () => {
        expect(commentsReducer(undefined, {})).to.be.instanceOf(Array)
    })
    it('handels action of type GET_COMMENTS', () => {
        const testArray = [
            {
                id: 0,
                postId: 0,
                content: 'Test comment',
                parent: 0
            },
            {
                id: 1,
                postId: 0,
                content: 'Comment 2',
                parent: 0
            }
        ]
        const action = { type: GET_COMMENTS, payload: testArray }
        expect(commentsReducer([], action)).to.eql(testArray)
    })
})