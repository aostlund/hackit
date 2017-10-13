import "regenerator-runtime/runtime" 
import { delay } from 'redux-saga'
import { takeEvery } from 'redux-saga/effects'
import { 
    ERROR,
    CLEAR_ERROR
} from '../actions/types'

export function* clearError() {
    yield delay(3000)
    yield put({
        type: CLEAR_ERROR
    })
}

export function* watchClearError() {
    yield takeEvery(ERROR, clearError)
}