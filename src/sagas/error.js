import "regenerator-runtime/runtime" 
import { delay } from 'redux-saga'
import { put, takeEvery } from 'redux-saga/effects'
import { 
    ERROR,
    CLEAR_ERROR
} from '../actions/types'

// Sends clear error action after three seconds
export function* clearError() {
    yield delay(3000)
    yield put({
        type: CLEAR_ERROR
    })
}

// Watches for action of type ERROR
export function* watchClearError() {
    yield takeEvery(ERROR, clearError)
}