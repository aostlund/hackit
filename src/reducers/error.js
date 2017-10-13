import { ERROR, CLEAR_ERROR } from '../actions/types'

export default function(state = '', action) {
    switch(action.type) {
        case ERROR:
            return action.payload
        case CLEAR_ERROR:
            return ''
    }
    return state
}