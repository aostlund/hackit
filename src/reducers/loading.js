import { LOADING, LOADING_FINISHED } from '../actions/types'

export default function(state = false, action) {
    (action.type, action.payload)
    switch (action.type) {
        case LOADING: 
            return state + 1
        case LOADING_FINISHED:
            return state <= 0 ? 0 : state - 1
    }
    return state
}