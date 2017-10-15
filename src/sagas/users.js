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

export function* watchFetchAllUsers() {
    yield takeEvery(FETCH_ALL_USERS, fetchAllUsers)
}

export function* toggleAdmin({ payload }) {
    console.log('cu', firebase.auth().currentUser.uid, 'pl', payload.uid)
    if (yield firebase.auth().currentUser.uid === payload.uid) {
        yield put({
            type: ERROR,
            payload: 'You can not remove admin from your own account'
        })
    } else {
       yield firebase.database().ref(`users/${payload.uid}`).update({ admin: !payload.admin })
    }
}

export function* watchToggleAdmin() {
    yield takeEvery(TOGGLE_ADMIN, toggleAdmin)
}

export function* deleteUser({ payload }) {
    yield firebase.database().ref(`users/${payload.uid}`).update({ delete: true })
}

export function* watchDeleteUser() {
    yield takeEvery(DELETE_USER, deleteUser)
}