import "regenerator-runtime/runtime" 
import _ from 'lodash'
import { eventChannel } from 'redux-saga'
import { put, takeEvery, cancelled, take, takeLatest, call } from 'redux-saga/effects'
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
    ERROR,
    CANCEL_POST_CHANNEL,
    DELETE_POST,
    CLEAR_EDITOR_CONTENT
} from '../actions/types'
import firebase from 'firebase'

export function delayedGet({payload: {start, perPage, score}}) {
    const ref = firebase.database().ref('posts')
    return eventChannel(emit => {
        const cb = ref.orderByChild('score').endAt(score, start).limitToLast(perPage).on('value',
            snapshot => {
                let data = snapshot.val()
                data = _.map(data, (val, id) => { return { id: id, ...val } } )
                data = data.sort((a,b) => a.id > b.id ? 1 : -1)
                emit (data)
            }
        )
        return () => ref.off('value', cb);
    })
}

export function* getPosts(payload) {
    yield put({
        type: GET_POSTS,
        payload: payload
    })
}

export function* watchPostChannel(payload) {
    let channel = yield call(delayedGet, payload)

    yield takeEvery(channel, getPosts)

    yield take(CANCEL_POST_CHANNEL)
    channel.close()
}

export function* watchDelayedGet() {
    yield takeLatest(DELAYED_GET_POSTS, watchPostChannel)
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
    let currentUser = yield firebase.auth().currentUser
    if (!currentUser) {
        yield put({
            type: ERROR,
            payload: 'You must be logged in to vote'
        })
    } else {
        let user = yield firebase.database().ref(`users/${currentUser.uid}`).once('value').then(snapshot => snapshot.val()).catch(e => error = e)
        if (user[update.payload.id]) {
            if (user[update.payload.id] + update.payload.change > 1 || user[update.payload.id] + update.payload.change < -1) {
                yield put({
                    type: ERROR,
                    payload: 'You cannot vote more than one point'
                })
            } else {
                let score = yield firebase.database().ref(`posts/${update.payload.id}`).once('value').then(snapshot => snapshot.val()).catch(e => error = e)
                score = score.score + update.payload.change
                yield firebase.database().ref(`posts/${update.payload.id}`).update({score: score}).catch(e => error = e)
                yield firebase.database().ref(`users/${currentUser.uid}`).update({ [update.payload.id]: user[update.payload.id] + update.payload.change}).catch(e => error = e)
            }
        } else {
            let score = yield firebase.database().ref(`posts/${update.payload.id}`).once('value').then(snapshot => snapshot.val()).catch(e => error = e)
            score = score.score + update.payload.change
            yield firebase.database().ref(`posts/${update.payload.id}`).update({score: score}).catch(e => error = e)
            yield firebase.database().ref(`users/${currentUser.uid}`).update({ [update.payload.id]: update.payload.change}).catch(e => error = e)
        }
        if (error.message) {
            yield put({
                type: ERROR,
                payload: error.message
            })
        }
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
        yield put({
            type: CLEAR_EDITOR_CONTENT
        })
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
    if (error && error.message) {
        yield put({
            type: ERROR,
            payload: error.message
        })
    } else {
        yield put({
            type: CLEAR_EDITOR_CONTENT
        })
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

export function* deletePost({ payload }) {
    let error = yield firebase.database().ref(`posts/${payload.id}`).remove().catch(error => error)
    if (error && error.messge) {
        yield put({
            type: ERROR,
            payload: error.message
        })
    } else {
        payload.history.push('/')
    }
}

export function* watchDeletePost() {
    yield takeEvery(DELETE_POST, deletePost)
}