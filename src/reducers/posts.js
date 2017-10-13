import {
    GET_POSTS,
    CHANGE_POST_SCORE,
    GET_POST
} from '../actions/types'

export default function(state = [], action) {
    switch (action.type) {
        case GET_POSTS:
            return action.payload
        case GET_POST:
            return action.payload
        case CHANGE_POST_SCORE:
            const index = state.findIndex(post => post.id === action.payload.id)
            return state.map((post, idx) => {
                if (idx === index) {
                    return {...post, score: post.score += action.payload.change}
                }
                return post
            })
            // return {...state, [action.payload.id]: {
            //             ...state[action.payload.id], 
            //             score: state[action.payload.id].score + action.payload.change
            //         }
            // }
    }
    return state
}