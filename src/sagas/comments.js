import "regenerator-runtime/runtime" 
import _ from 'lodash'
import { delay, eventChannel } from 'redux-saga'
import { put, takeEvery } from 'redux-saga/effects'
import { 
    CHANGE_COMMENT_SCORE,
    SAVE_COMMENT,
    SAVE_EDITED_COMMENT,
    FETCH_COMMENTS,
    GET_COMMENTS,
    FETCH_COMMENT,
    GET_COMMENT,
    ERROR
} from '../actions/types'
import firebase from 'firebase'

export function* changeCommentScore(update) {
    let error = {}
    let currentUser = yield firebase.auth().currentUser.uid
    let user = yield firebase.database().ref(`users/${currentUser}`).once('value').then(snapshot => snapshot.val()).catch(e => error = e)
    if (user[update.payload.id]) {
        if ((user[update.payload.id] + update.payload.change) > 1 || (user[update.payload.id] + update.payload.change) < -1) {
            yield put({
                type: ERROR,
                payload: 'You cannot vote more than one point'
            })
            let comment = yield firebase.database().ref(`comments/${update.payload.id}`).once('value').then(snapshot => snapshot.val()).catch(e => error = e)
            yield put({
                type: FETCH_COMMENTS,
                payload: {id: comment.post }
            })
        } else {
            let score = yield firebase.database().ref(`comments/${update.payload.id}`).once('value').then(snapshot => snapshot.val()).catch(e => error = e)
            score = score.score + update.payload.change
            yield firebase.database().ref(`comments/${update.payload.id}`).update({score: score}).catch(e => error = e)
            yield firebase.database().ref(`users/${currentUser}`).update({ [update.payload.id]: user[update.payload.id] + update.payload.change}).catch(e => error = e)
        }
    } else {
        let score = yield firebase.database().ref(`comments/${update.payload.id}`).once('value').then(snapshot => snapshot.val()).catch(e => error = e)
        score = score.score + update.payload.change
        yield firebase.database().ref(`comments/${update.payload.id}`).update({score: score}).catch(e => error = e)
        yield firebase.database().ref(`users/${currentUser}`).update({ [update.payload.id]: update.payload.change}).catch(e => error = e)
    }
    if (error.message) {
        yield put({
            type: ERROR,
            payload: error.message
        })
    }
}

export function* watchChangeCommentScore() {
    yield takeEvery(CHANGE_COMMENT_SCORE, changeCommentScore)
}


export function* saveComment({ payload: { content, history }}) {
    let error = yield firebase.database().ref('comments').push({
        content: JSON.stringify(content.content),
        post: content.post,
        parent: content.parent,
        score: 0,
        user: yield firebase.auth().currentUser.uid,
        userName: yield firebase.auth().currentUser.displayName
    }).catch(error => error)
    let post = yield firebase.database().ref(`posts/${content.post}`).once('value').then(snapshot => snapshot.val()).catch(e => error = e)
    yield firebase.database().ref(`posts/${content.post}`).update({
        "comments": (post.comments || 0) + 1
    }).catch(e => error = e)
    if (error.message) {
        yield put({
            type: ERROR,
            payload: error.message
        })
    } else {
        history.push(`/comments/${content.post}`)
    }
}

export function* watchSaveComment() {
    yield takeEvery(SAVE_COMMENT, saveComment)
}

export function* saveEditedComment({ payload: { content, history, id}}) {
    let error = yield firebase.database().ref(`comments/${id}`).update({"content": JSON.stringify(content.content)}).catch(error => error)
    if (error.message) {
        yield put({
            type: ERROR,
            payload: error.message
        })
    } else {
        history.go(-1)
    }
}

export function* watchSaveEditedComment() {
    yield takeEvery(SAVE_EDITED_COMMENT, saveEditedComment)
}

export function* getComments({ payload }) {
    let error = {}
    let data = yield firebase.database().ref('comments').orderByChild('post').equalTo(payload.id).once('value').then(snapshot => snapshot.val()).catch(e => error = e)
    if (error.message) {
        yield put({
            type: ERROR,
            payload: error.message
        })
    } else {
        yield put({
            type: GET_COMMENTS,
            payload: _.map(data, (val, id) => { return { id: id, ...val} })
        })
    }
}

export function* watchGetComments() {
    yield takeEvery(FETCH_COMMENTS, getComments)
}

export function* getComment({ payload }) {
    let error = {}
    let comment = yield firebase.database().ref(`comments/${payload}`).once('value').then(snapshot => snapshot.val()).catch(e => error = e)
    if (error.message) {
        yield put({
            type: ERROR,
            payload: error.message
        })
    } else {
        yield put({
            type: GET_COMMENT,
            payload: {...comment, id: payload }
        })
    }
}

export function* watchGetComment() {
    yield takeEvery(FETCH_COMMENT, getComment)
}