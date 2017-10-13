import { renderComponent, expect } from '../test_helper'
import PostList from '../../src/components/post_list'

describe('PostList', () => {
    let component
    
    beforeEach(() => {
        const props = {
            posts: [
                {
                    title: 'Test',
                    link: 'http://test.link',
                    id: 0
                },
                {
                    title: 'SecondTest',
                    link: 'http://test2.link',
                    id: 1
                }
            ]
        }
        component = renderComponent(PostList, null, props)
    })

    it('shows a LI for each post', () => {
        expect(component.find('li').length).to.equal(2)
    })

    it('shows eacd post that is provided', () => {
        expect(component).to.contain('Test')
        expect(component).to.contain('SecondTest')
    })    
})