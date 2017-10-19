import {
    GET_COMMENTS,
    CHANGE_COMMENT_SCORE,
    GET_COMMENT
} from '../actions/types'

export default function(state = [], action) {
    switch (action.type) {
        case GET_COMMENTS:
            return action.payload
        case GET_COMMENT:
            return [action.payload]
    }
    return state
}