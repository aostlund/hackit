import "regenerator-runtime/runtime" 
import _ from 'lodash'
import { put, takeEvery } from 'redux-saga/effects'
import { 
    GET_POSTS,
    DELAYED_GET_POSTS,
    CHANGE_POST_SCORE,
    SAVE_POST,
    SAVE_EDITED_POST,
    GET_POST,
    FETCH_POST,
} from '../actions/types'
import firebase from 'firebase'

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