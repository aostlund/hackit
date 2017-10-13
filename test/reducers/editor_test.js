import { expect } from '../test_helper'
import editorReducer from '../../src/reducers/editor'
import { UPDATE_EDITOR_CONTENT } from '../../src/actions/types'

describe('EditorReducer', () => {
    it('handels action with unknown types', () => {
        expect(editorReducer(undefined, {})).to.be.instanceOf(Object)
    })
    it('handels action of UPDATE_EDITOR_CONTENT', () => {
        const action = { type: UPDATE_EDITOR_CONTENT, payload: { test: 'test' } }
        expect(editorReducer([], action)).to.eql({ test: 'test' })
    })
})