import "regenerator-runtime/runtime" 
import { eventChannel } from 'redux-saga'
import { put, takeEvery, cancelled } from 'redux-saga/effects'
import { 
    TRACK_USER_STATUS,
    CHANGE_USER_STATE,
    LOGIN_USER,
    LOGOUT_USER,
    SIGNUP_USER,
    SIGNUP_GOOGLE,
    ERROR
} from '../actions/types'
import firebase from 'firebase'

// Tracks changes in Auth state and emits data to an action forwarder
export function* watchTrackUserStatus() {
    const authChannel = eventChannel(emit => {
        const unsubscribe = firebase.auth().onAuthStateChanged(
            user => {
                if (user) {
                    // If user is only in auth put it in the database
                    const userReference = firebase.database().ref(`users/${user.uid}`)
                    userReference.once('value', snapshot => {
                        if (!snapshot.val()) {
                            userReference.set({
                                email: user.email,
                                displayName: user.displayName,
                                admin: false,
                                delete: false 
                            })
                        // If user is set to be deleted it we remove it both from database and auth
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

// Takes emitted data and sends action
export function* trackUserStatus({ uid, user }) {
    yield put({
        type: CHANGE_USER_STATE,
        payload: user ? { uid, ...yield user.then(snapshot => snapshot.val()) } : user
    })
}

// Logs in user with email and password
export function* loginUser({ payload: {email, password} }) {
    let error = yield firebase.auth().signInWithEmailAndPassword(email, password).catch(error => error)
    if (error.message) {
        yield put({ type: ERROR, payload: error.message})
    }
}

// Watches for action of type LOGIN_USER
export function* watchLoginUser() {
    yield takeEvery(LOGIN_USER, loginUser)
}

// Logs user out
export function* logoutUser() {
    firebase.auth().signOut()
}

// Watches for action of type LOGOUT_USER
export function* watchLogoutUser() {
    yield takeEvery(LOGOUT_USER, logoutUser)
}

// Signs up user with email and password
export function* signupUser({ payload: {displayname, email, password, history } }) {
    if (displayname != '') {
        let error = yield firebase.auth().createUserWithEmailAndPassword(email, password).catch(error => error)
        if (error || error.message) {
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

// Watches for action of type LOGOUT_USER
export function* watchSignupUser() {
    yield takeEvery(SIGNUP_USER, signupUser)
}

// Signs user up with google social accounts. Also works to log them in.
export function* signupGoogle() {
    let provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('profile')
    provider.addScope('email')
    yield firebase.auth().signInWithPopup(provider).then(result => result)
}

// Watches for action of type SIGNUP_GOOGLE
export function* watchSignupWithGoogle() {
    yield takeEvery(SIGNUP_GOOGLE, signupGoogle)
}