import "regenerator-runtime/runtime" 
import _ from 'lodash'
import { eventChannel } from 'redux-saga'
import { put, takeEvery, cancelled, take, takeLatest, call } from 'redux-saga/effects'
import { 
    GET_POSTS,
    FETCH_POSTS,
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

// Gets posts
export function* fetchPosts({payload: {start, perPage, score}}) {
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

// Puts out action GET_POST with comments as payload
export function* getPosts(payload) {
    yield put({
        type: GET_POSTS,
        payload: payload
    })
}

// Creates and listens to posts channel
export function* watchPostsChannel(payload) {
    let channel = yield call(fetchPosts, payload)

    yield takeEvery(channel, getPosts)

    yield take(CANCEL_POST_CHANNEL)
    channel.close()
}

// Watches for an action of type FETCH_POST
export function* watchDelayedGet() {
    yield takeLatest(FETCH_POSTS, watchPostsChannel)
}

// Returns number of posts (unused)
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

// Watches for an action of type GET_NUM_POSTS
export function* watchNumPosts() {
    yield takeEvery(GET_NUM_POSTS, numPosts)
}

// Changes score on post
export function* changePostScore(update) {
    let error = {}
    let currentUser = yield firebase.auth().currentUser
    // Only logged in users can vote
    if (!currentUser) {
        yield put({
            type: ERROR,
            payload: 'You must be logged in to vote'
        })
    } else {
        let user = yield firebase.database().ref(`users/${currentUser.uid}`).once('value').then(snapshot => snapshot.val()).catch(e => error = e)
        // Has the user voted on this post previously
        if (user[update.payload.id]) {
            // User can only move score one point in either direction
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

// Watches for an action of type CHANGE_POST_SCORE
export function* watchChangePostScore() {
    yield takeEvery(CHANGE_POST_SCORE, changePostScore)
}

// Saves post
export function* savePost({ payload: { content, history }}) {
    console.log(content)
    let error = {}
    if (!content.link) {
        content.link = ''
    }
    if (!content.content) {
        content.content = {}
    }
    yield firebase.database().ref('posts').push({
        content: JSON.stringify(content.content),
        title: content.title,
        link: ~content.link.indexOf('http') || content.link === '' ? content.link : `http://${content.link}`, //make sure we add "http://" if link doesn´t have it
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

// Watches for an action of type SAVE_POST
export function* watchSavePost() {
    yield takeEvery(SAVE_POST, savePost)
}

// Saves edited post
export function* saveEditedPost({ payload: { content, history, id}}) {
    if (content.content) {
        content.content = JSON.stringify(content.content)
    }
    if (content.link) {
        content.link = ~content.link.indexOf('http') || content.link === '' ? content.link : `http://${content.link}`
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

// Watches for an action of type SAVE_EDITED_POST
export function* watchSaveEditedPost() {
    yield takeEvery(SAVE_EDITED_POST, saveEditedPost)
}

// Fetches post
export function* fetchPost({ payload }) {
    const ref = firebase.database().ref(`posts/${payload}`)
    return eventChannel(emit => {
        const cb = ref.on('value',
            snapshot => {
                let data = snapshot.val()
                data.id = payload
                emit ([data])
            }
        )
        return () => ref.off('value', cb);
    })
}

// Puts action of GET_POST with payload of the fetched post
export function* putPost(payload) {
    yield put({
        type: GET_POST,
        payload: payload
    })
}

// Creates a post channel and listens to it
export function* watchPostChannel(payload) {
    let channel = yield call(fetchPost, payload)

    yield takeEvery(channel, putPost)

    yield take(CANCEL_POST_CHANNEL)
    channel.close()
}

// Watches for an action of type FETCH_POST
export function* watchFetchPost() {
    yield takeEvery(FETCH_POST, watchPostChannel)
}

// Deletes post
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

// Watches for an action of type DELETE_POST
export function* watchDeletePost() {
    yield takeEvery(DELETE_POST, deletePost)
}