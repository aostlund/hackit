import "regenerator-runtime/runtime" 
import { delay, eventChannel } from 'redux-saga'
import _ from 'lodash'
import { put, takeEvery, takeLatest, call, take } from 'redux-saga/effects'
import { 
    FETCH_ALL_USERS,
    GET_ALL_USERS,
    TOGGLE_ADMIN,
    DELETE_USER,
    ERROR
} from '../actions/types'
import firebase from 'firebase'

// Fetches all users
export function* fetchAllUsers() {
    const ref = firebase.database().ref('users')
    const channel = eventChannel(emit => {
        const cb = ref.on('value',
            snapshot => {
                emit (_.map(snapshot.val(), (val, uid) => { return { uid, ...val}}))
            }
        )
        return () => ref.off('value', cb)
    })
    yield takeEvery(channel, function*(payload) {
        yield put({
            type: GET_ALL_USERS,
            payload,
        })
    })
}

// Watches for an action of type FETCH_ALL_USERS
export function* watchFetchAllUsers() {
    yield takeEvery(FETCH_ALL_USERS, fetchAllUsers)
}

// Toggle the user admin status
export function* toggleAdmin({ payload }) {
    if (yield firebase.auth().currentUser.uid === payload.uid) {
        yield put({
            type: ERROR,
            payload: 'You can not remove admin from your own account'
        })
    } else {
       yield firebase.database().ref(`users/${payload.uid}`).update({ admin: !payload.admin })
    }
}

// Watches for an action of type TOGGLE_ADMIN
export function* watchToggleAdmin() {
    yield takeEvery(TOGGLE_ADMIN, toggleAdmin)
}

// Sets delete property to true
export function* deleteUser({ payload }) {
    yield firebase.database().ref(`users/${payload.uid}`).update({ delete: true })
}

// Watches for an action of type DELETE_USER
export function* watchDeleteUser() {
    yield takeEvery(DELETE_USER, deleteUser)
}