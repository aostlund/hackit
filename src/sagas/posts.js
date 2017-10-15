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
    NUM_POSTS,
    GET_NUM_POSTS,
    ERROR
} from '../actions/types'
import firebase from 'firebase'

export function* delayedGet({payload: {start, perPage, score}}) {
    let error = {}
    let data = yield firebase.database().ref('posts')
        .orderByChild('score').endAt(score, start).limitToLast(perPage).once('value')
        .then(snapshot => snapshot.val())
        .catch(e => error = e)
    data = _.map(data, (val, id) =>  { return { id: id, ...val } })
    data = data.sort((a,b) => a.id > b.id ? 1 : -1)
    if (error.message) {
        put({
            type: ERROR,
            payload: error.message
        })
    } else {
        yield put({ type: GET_POSTS, payload: data })
    }
}

export function* watchDelayedGet() {
    yield takeEvery(DELAYED_GET_POSTS, delayedGet)
}

export function* numPosts() {
    let error = {}
    let data = yield fetch('https://webapp2-8a6f8.firebaseio.com/posts.json?shallow=true')
        .then(res => res.json())
        .then(res => res)
        .catch(e => error = e)
    if (error.message) {
        yield put({
            type: ERROR,
            payload: error.message
        })
    } else {
        yield put({
            type: NUM_POSTS,
            payload: Object.keys(data).length
        })
    }
}

export function* watchNumPosts() {
    yield takeEvery(GET_NUM_POSTS, numPosts)
}

export function* changePostScore(update) {
    let error = {}
    let currentUser = yield firebase.auth().currentUser.uid
    let user = yield firebase.database().ref(`users/${currentUser}`).once('value').then(snapshot => snapshot.val()).catch(e => error = e)
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
            let score = yield firebase.database().ref(`posts/${update.payload.id}`).once('value').then(snapshot => snapshot.val()).catch(e => error = e)
            score = score.score + update.payload.change
            yield firebase.database().ref(`posts/${update.payload.id}`).update({score: score}).catch(e => error = e)
            yield firebase.database().ref(`users/${currentUser}`).update({ [update.payload.id]: user[update.payload.id] + update.payload.change}).catch(e => error = e)
        }
    } else {
        let score = yield firebase.database().ref(`posts/${update.payload.id}`).once('value').then(snapshot => snapshot.val()).catch(e => error = e)
        score = score.score + update.payload.change
        yield firebase.database().ref(`posts/${update.payload.id}`).update({score: score}).catch(e => error = e)
        yield firebase.database().ref(`users/${currentUser}`).update({ [update.payload.id]: update.payload.change}).catch(e => error = e)
    }
    if (error.message) {
        yield put({
            type: ERROR,
            payload: error.message
        })
    }
}

export function* watchChangePostScore() {
    yield takeEvery(CHANGE_POST_SCORE, changePostScore)
}

export function* savePost({ payload: { content, history }}) {
    let error = {}
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
    }).catch(e => error = e)
    if (error.message) {
        yield put({
            type: ERROR,
            payload: error.message
        })
    } else {
        history.push('/')
    }
}
export function* watchSavePost() {
    yield takeEvery(SAVE_POST, savePost)
}

export function* saveEditedPost({ payload: { content, history, id}}) {
    if (content.content) {
        content.content = JSON.stringify(content.content)
    }
    let error = yield firebase.database().ref(`posts/${id}`).update(content).catch(error => error)
    if (error.message) {
        yield put({
            type: ERROR,
            payload: error.message
        })
    } else {
        history.go(-1)
    }
}

export function* watchSaveEditedPost() {
    yield takeEvery(SAVE_EDITED_POST, saveEditedPost)
}

export function* fetchPost({ payload }) {
    let error = {}
    let post = yield firebase.database().ref(`posts/${payload}`).once('value').then(snapshot => snapshot.val()).catch(e => error = e) 
    if (error.message) {
        yield put({
            type: ERROR,
            payload: error.message
        })
    } else {
        post.content = JSON.parse(post.content)
        yield put({
            type: GET_POST,
            payload: [{id: payload, ...post}]
        })
    }
}

export function* watchFetchPost() {
    yield takeEvery(FETCH_POST, fetchPost)
}