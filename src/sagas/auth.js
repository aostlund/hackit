import "regenerator-runtime/runtime" 
import { eventChannel } from 'redux-saga'
import { put, takeEvery, cancelled } from 'redux-saga/effects'
import { 
    TRACK_USER_STATUS,
    CHANGE_USER_STATE,
    LOGIN_USER,
    LOGOUT_USER,
    SIGNUP_USER,
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
            // error => emit({ error })
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
    firebase.auth().signInWithEmailAndPassword(email, password)
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
    yield firebase.auth().createUserWithEmailAndPassword(email, password)
    let error = yield firebase.auth().currentUser.updateProfile({
        displayName: displayname
    }).catch(error => error)
    if (error) {
        yield put({
            type: ERROR,
            payload: error
        })
    } else {
        history.go(-1)
    }
}

export function* watchSignupUser() {
    yield takeEvery(SIGNUP_USER, signupUser)
}