import { renderComponent, expect } from '../test_helper'
import Comments from '../../src/components/comments'

describe('Comments', () => {
    let component
    
    beforeEach(() => {
        const props = {
            comments: [
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
        }
        component = renderComponent(Comments, null, props)
    })

    it('shows a LI for each comment', () => {
        expect(component.find('li').length).to.equal(2)
    })

    it('shows each comment that is provided', () => {
        expect(component).to.contain('Test')
        expect(component).to.contain('Comment')
    })    
})