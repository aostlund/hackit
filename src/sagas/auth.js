import "regenerator-runtime/runtime" 
import { eventChannel } from 'redux-saga'
import { put, takeEvery, cancelled } from 'redux-saga/effects'
import { 
    TRACK_USER_STATUS,
    CHANGE_USER_STATE,
    LOGIN_USER,
    LOGOUT_USER,
    SIGNUP_USER,
    ERROR
} from '../actions/types'
import firebase from 'firebase'

export function* watchTrackUserStatus() {
    const authChannel = eventChannel(emit => {
        const unsubscribe = firebase.auth().onAuthStateChanged(
            user => {
                if (user) {
                    const userReference = firebase.database().ref(`users/${user.uid}`)
                    userReference.once('value', snapshot => {
                        if (!snapshot.val()) {
                            userReference.set({
                                email: user.email,
                                displayname: user.displayName
                            })
                        }
                    })
                }
                emit({ user })
            }
        )
        return unsubscribe;
    });
    try {
        yield takeEvery(authChannel, trackUserStatus);
    } finally {
        if (yield cancelled()) authChannel.close();
    }
}

export function* trackUserStatus({ user }) {
    yield put({
        type: CHANGE_USER_STATE,
        payload: user
    })
}

export function* loginUser({ payload: {email, password} }) {
    let error = yield firebase.auth().signInWithEmailAndPassword(email, password).catch(error => error)
    if (error.message) {
        yield put({ type: ERROR, payload: error.message})
    }
}

export function* watchLoginUser() {
    yield takeEvery(LOGIN_USER, loginUser)
}

export function* logoutUser() {
    firebase.auth().signOut()
}

export function* watchLogoutUser() {
    yield takeEvery(LOGOUT_USER, logoutUser)
}

export function* signupUser({ payload: {displayname, email, password, history } }) {
    if (displayname != '') {
        let error = yield firebase.auth().createUserWithEmailAndPassword(email, password).catch(error => error)
        if (error.message) {
            yield put({
                type: ERROR,
                payload: error.message
            })
        } else {
            error = yield firebase.auth().currentUser.updateProfile({
                displayName: displayname
            }).catch(error => error)
            if (error.message) {
                yield put({
                    type: ERROR,
                    payload: error.message
                })
            } else {
                history.go(-1)
            }
        }
    } else {
        yield put({
            type: ERROR,
            payload: 'Displayname missing'
        })
    }
}

export function* watchSignupUser() {
    yield takeEvery(SIGNUP_USER, signupUser)
}