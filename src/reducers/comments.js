import {
    GET_COMMENTS,
    CHANGE_COMMENT_SCORE,
    GET_COMMENT
} from '../actions/types'

export default function(state = [], action) {
    switch (action.type) {
        case GET_COMMENTS:
            return action.payload
        // case CHANGE_COMMENT_SCORE:
        //     const index = state.findIndex(comment => comment.id === action.payload.id)
        //     return state.map((comment, idx) => {
        //         if (idx === index) {
        //             return {...comment, score: comment.score += action.payload.change}
        //         }
        //         return comment
        //     })
        case GET_COMMENT:
            return [action.payload]
    }
    return state
}