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
                                displayName: user.displayName,
                                admin: false,
                                delete: false 
                            })
                        } else if (snapshot.val().delete) {
                            user.delete()
                            userReference.remove()
                        }
                    })
                }
                if (user) {
                    emit({ uid: user.uid, user: firebase.database().ref(`users/${user.uid}`).once('value') })
                } else {
                    emit ({ user })
                }
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

export function* trackUserStatus({ uid, user }) {
    yield put({
        type: CHANGE_USER_STATE,
        payload: user ? { uid, ...yield user.then(snapshot => snapshot.val()) } : user
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
            yield firebase.auth().currentUser.updateProfile({
                displayName: displayname
            })
            yield firebase.database().ref(`users/${yield firebase.auth().currentUser.uid}`).update({displayName: displayname})
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