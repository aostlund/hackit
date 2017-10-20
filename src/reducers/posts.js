import {
    GET_POSTS,
    CHANGE_POST_SCORE,
    GET_POST,
    NUM_POSTS
} from '../actions/types'

export default function(state = { posts: []}, action) {
    switch (action.type) {
        case GET_POSTS:
            return {...state, posts: action.payload }
        case GET_POST:
            return {...state, posts: action.payload }
        case NUM_POSTS:
            return {...state, numPosts: action.payload}
    }
    return state
}