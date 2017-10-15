import {
    GET_POSTS,
    CHANGE_POST_SCORE,
    GET_POST,
    NUM_POSTS
} from '../actions/types'

export default function(state = {}, action) {
    switch (action.type) {
        case GET_POSTS:
            return {...state, posts: action.payload }
        case GET_POST:
            return {...state, posts: action.payload }
        case CHANGE_POST_SCORE:
            const index = state.posts.findIndex(post => post.id === action.payload.id)
            return {...state, posts: state.posts.map((post, idx) => {
                if (idx === index) {
                    return {...post, score: post.score += action.payload.change}
                }
                return post
            })}
        case NUM_POSTS:
            return {...state, numPosts: action.payload}
    }
    return state
}