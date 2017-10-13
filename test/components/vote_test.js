import { renderComponent, expect } from '../test_helper'
import Vote from '../../src/components/vote'

describe('Vote', () => {
    let component

    beforeEach(() => {
        const props = {
            score: 5
        }
        component = renderComponent(Vote, props)
    })
    it('shows the provided score', () => {
        expect(component).to.contain('5')
    })
    it('shows increase/decrease buttons', () => {
        expect(component.find('button').length).to.equal(2)
    })
})