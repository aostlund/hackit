import {
    CHANGE_USER_STATE
} from '../actions/types'

export default function(state = null, action) {
    switch (action.type) {
        case CHANGE_USER_STATE:
            return action.payload
    }
    return state
}