import "regenerator-runtime/runtime" 
import _ from 'lodash'
import { delay, eventChannel } from 'redux-saga'
import { ContentState } from 'draft-js'
import { all, put, takeEvery, call, take, takeLatest, cancelled } from 'redux-saga/effects'
import { 
    GET_POSTS,
    DELAYED_GET_POSTS,
    CHANGE_POST_SCORE,
    CHANGE_COMMENT_SCORE,
    SAVE_POST,
    SAVE_EDITED_POST,
    GET_POST,
    FETCH_POST,
    SAVE_COMMENT,
    SAVE_EDITED_COMMENT,
    FETCH_COMMENTS,
    GET_COMMENTS,
    FETCH_COMMENT,
    GET_COMMENT,
    TRACK_USER_STATUS,
    CHANGE_USER_STATE,
    LOGIN_USER,
    LOGOUT_USER,
    SIGNUP_USER,
    ERROR,
    CLEAR_ERROR
} from '../actions/types'
import firebase from 'firebase'

export function* testSaga() {
    // firebase.database().ref('posts').push({
    //             title: 'Second Test',
    //             link: 'http://test2.link',
    //             score: 10,
    //             info: 'video'
    // })
}

export function* delayedGet() {
    let data = yield firebase.database().ref('posts').once('value').then(snapshot => snapshot.val())   
    data = _.map(data, (val, id) =>  { return { id: id, ...val } })
    yield put({ type: GET_POSTS, payload: data })
}

export function* watchDelayedGet() {
    yield takeEvery(DELAYED_GET_POSTS, delayedGet)
}

export function* changePostScore(update) {
    let currentUser = yield firebase.auth().currentUser.uid
    let user = yield firebase.database().ref(`users/${currentUser}`).once('value').then(snapshot => snapshot.val())
    if (user[update.payload.id]) {
        if (user[update.payload.id] + update.payload.change > 1 || user[update.payload.id] + update.payload.change < -1) {
            yield put({
                type: ERROR,
                payload: 'You cannot vote more than one point'
            })
            yield put({
                type: DELAYED_GET_POSTS
            })
        } else {
            let score = yield firebase.database().ref(`posts/${update.payload.id}`).once('value').then(snapshot => snapshot.val())
            score = score.score + update.payload.change
            yield firebase.database().ref(`posts/${update.payload.id}`).update({score: score})
            yield firebase.database().ref(`users/${currentUser}`).update({ [update.payload.id]: user[update.payload.id] + update.payload.change})
        }
    } else {
        let score = yield firebase.database().ref(`posts/${update.payload.id}`).once('value').then(snapshot => snapshot.val())
        score = score.score + update.payload.change
        yield firebase.database().ref(`posts/${update.payload.id}`).update({score: score})
        yield firebase.database().ref(`users/${currentUser}`).update({ [update.payload.id]: update.payload.change})
    }
}

export function* watchChangePostScore() {
    yield takeEvery(CHANGE_POST_SCORE, changePostScore)
}

export function* changeCommentScore(update) {
    let currentUser = yield firebase.auth().currentUser.uid
    let user = yield firebase.database().ref(`users/${currentUser}`).once('value').then(snapshot => snapshot.val())
    if (user[update.payload.id]) {
        if ((user[update.payload.id] + update.payload.change) > 1 || (user[update.payload.id] + update.payload.change) < -1) {
            yield put({
                type: ERROR,
                payload: 'You cannot vote more than one point'
            })
            let comment = yield firebase.database().ref(`comments/${update.payload.id}`).once('value').then(snapshot => snapshot.val())
            yield put({
                type: FETCH_COMMENTS,
                payload: {id: comment.post }
            })
        } else {
            let score = yield firebase.database().ref(`comments/${update.payload.id}`).once('value').then(snapshot => snapshot.val())
            score = score.score + update.payload.change
            yield firebase.database().ref(`comments/${update.payload.id}`).update({score: score})
            yield firebase.database().ref(`users/${currentUser}`).update({ [update.payload.id]: user[update.payload.id] + update.payload.change})
        }
    } else {
        let score = yield firebase.database().ref(`comments/${update.payload.id}`).once('value').then(snapshot => snapshot.val())
        score = score.score + update.payload.change
        yield firebase.database().ref(`comments/${update.payload.id}`).update({score: score})
        yield firebase.database().ref(`users/${currentUser}`).update({ [update.payload.id]: update.payload.change})
    }
    // let score = yield firebase.database().ref(`comments/${update.payload.id}`).once('value').then(snapshot => snapshot.val())
    // score = score.score + update.payload.change
    // yield firebase.database().ref(`comments/${update.payload.id}`).update({score: score})
}

export function* watchChangeCommentScore() {
    yield takeEvery(CHANGE_COMMENT_SCORE, changeCommentScore)
}

export function* savePost({ payload: { content, history }}) {
    if (!content.link) {
        content.link = ''
    }
    yield firebase.database().ref('posts').push({
        content: JSON.stringify(content.content),
        title: content.title,
        link: content.link,
        score: 0,
        comments: 0,
        user: yield firebase.auth().currentUser.uid,
        userName: yield firebase.auth().currentUser.displayName
    })
    history.push('/')
}
export function* watchSavePost() {
    yield takeEvery(SAVE_POST, savePost)
}

export function* saveEditedPost({ payload: { content, history, id}}) {
    if (content.content) {
        content.content = JSON.stringify(content.content)
    }
    yield firebase.database().ref(`posts/${id}`).update(content)
    history.go(-1)
}

export function* watchSaveEditedPost() {
    yield takeEvery(SAVE_EDITED_POST, saveEditedPost)
}

export function* fetchPost({ payload }) {
    let post = yield firebase.database().ref(`posts/${payload}`).once('value').then(snapshot => snapshot.val())
    post.content = JSON.parse(post.content)
    yield put({
        type: GET_POST,
        payload: [{id: payload, ...post}]
    })
}

export function* watchFetchPost() {
    yield takeEvery(FETCH_POST, fetchPost)
}

export function* saveComment({ payload: { content, history }}) {
    yield firebase.database().ref('comments').push({
        content: JSON.stringify(content.content),
        post: content.post,
        parent: content.parent,
        score: 0,
        user: yield firebase.auth().currentUser.uid,
        userName: yield firebase.auth().currentUser.displayName
    })
    let post = yield firebase.database().ref(`posts/${content.post}`).once('value').then(snapshot => snapshot.val())
    yield firebase.database().ref(`posts/${content.post}`).update({
        "comments": (post.comments || 0) + 1
    })
    history.push(`/comments/${content.post}`)
}

export function* watchSaveComment() {
    yield takeEvery(SAVE_COMMENT, saveComment)
}

export function* saveEditedComment({ payload: { content, history, id}}) {
    yield firebase.database().ref(`comments/${id}`).update({"content": JSON.stringify(content.content)})
    history.go(-1)
}

export function* watchSaveEditedComment() {
    yield takeEvery(SAVE_EDITED_COMMENT, saveEditedComment)
}

export function* getComments({ payload }) {
    let data = yield firebase.database().ref('comments').orderByChild('post').equalTo(payload.id).once('value').then(snapshot => snapshot.val())
    yield put({
        type: GET_COMMENTS,
        payload: _.map(data, (val, id) => { return { id: id, ...val} })
    })
}

export function* watchGetComments() {
    yield takeEvery(FETCH_COMMENTS, getComments)
}

export function* getComment({ payload }) {
    let comment = yield firebase.database().ref(`comments/${payload}`).once('value').then(snapshot => snapshot.val())
    yield put({
        type: GET_COMMENT,
        payload: {...comment, id: payload }
    })
}

export function* watchGetComment() {
    yield takeEvery(FETCH_COMMENT, getComment)
}

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

export function* clearError() {
    yield delay(3000)
    yield put({
        type: CLEAR_ERROR
    })
}

export function* watchClearError() {
    yield takeEvery(ERROR, clearError)
}

export default function* rootSaga() {
    yield all([
        testSaga(),
        watchDelayedGet(),
        watchChangePostScore(),
        watchChangeCommentScore(),
        watchSavePost(),
        watchSaveEditedPost(),
        watchFetchPost(),
        watchSaveComment(),
        watchSaveEditedComment(),
        watchGetComments(),
        watchGetComment(),
        watchTrackUserStatus(),
        watchLoginUser(),
        watchLogoutUser(),
        watchSignupUser(),
        watchClearError()
    ])
}