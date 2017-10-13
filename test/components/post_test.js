import { renderComponent, expect } from '../test_helper'
import Post from '../../src/components/post'

describe('Post', () => {
    let component

    beforeEach(() => {
        const props = {
            title: 'Test',
            link: 'http://test.link',
            id: 0,
            score: 5
        }

        component = renderComponent(Post, props)
    })

    it('shows two A tags for each post', () => {
        expect(component.find('a').length).to.equal(2)
    })

    it('shows shows post that is provided', () => {
        expect(component).to.contain('Test')
    })
    it('shows provided score', () => {
        expect(component).to.contain('5')
    })
})