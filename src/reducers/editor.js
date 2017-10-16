import {
    UPDATE_EDITOR_CONTENT,
    CLEAR_EDITOR_CONTENT
} from '../actions/types'

export default function(state = {}, action) {
    switch (action.type) {
        case UPDATE_EDITOR_CONTENT:
            return action.payload
        case CLEAR_EDITOR_CONTENT:
            return {}
    }
    return state
}