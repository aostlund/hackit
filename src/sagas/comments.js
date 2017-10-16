import "regenerator-runtime/runtime" 
import _ from 'lodash'
import { delay, eventChannel } from 'redux-saga'
import { put, takeEvery, takeLatest, call, take } from 'redux-saga/effects'
import { 
    CHANGE_COMMENT_SCORE,
    SAVE_COMMENT,
    SAVE_EDITED_COMMENT,
    FETCH_COMMENTS,
    GET_COMMENTS,
    FETCH_COMMENT,
    GET_COMMENT,
    ERROR,
    CANCEL_COMMENTS_CHANNEL,
    DELETE_COMMENT,
    CLEAR_EDITOR_CONTENT
} from '../actions/types'
import firebase from 'firebase'

export function* changeCommentScore(update) {
    let error = {}
    let currentUser = yield firebase.auth().currentUser
    if(currentUser) {
        let user = yield firebase.database().ref(`users/${currentUser.uid}`).once('value').then(snapshot => snapshot.val()).catch(e => error = e)
        if (user[update.payload.id]) {
            if ((user[update.payload.id] + update.payload.change) > 1 || (user[update.payload.id] + update.payload.change) < -1) {
                yield put({
                    type: ERROR,
                    payload: 'You cannot vote more than one point'
                })
                let comment = yield firebase.database().ref(`comments/${update.payload.id}`).once('value').then(snapshot => snapshot.val()).catch(e => error = e)
            } else {
                let score = yield firebase.database().ref(`comments/${update.payload.id}`).once('value').then(snapshot => snapshot.val()).catch(e => error = e)
                score = score.score + update.payload.change
                yield firebase.database().ref(`comments/${update.payload.id}`).update({score: score}).catch(e => error = e)
                yield firebase.database().ref(`users/${currentUser.uid}`).update({ [update.payload.id]: user[update.payload.id] + update.payload.change}).catch(e => error = e)
            }
        } else {
            let score = yield firebase.database().ref(`comments/${update.payload.id}`).once('value').then(snapshot => snapshot.val()).catch(e => error = e)
            score = score.score + update.payload.change
            yield firebase.database().ref(`comments/${update.payload.id}`).update({score: score}).catch(e => error = e)
            yield firebase.database().ref(`users/${currentUser.uid}`).update({ [update.payload.id]: update.payload.change}).catch(e => error = e)
        }
        if (error.message) {
            yield put({
                type: ERROR,
                payload: error.message
            })
        }
    } else {
        yield put({
            type: ERROR,
            payload: 'You must be logged in to vote'
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
    if (error && error.message) {
        yield put({
            type: ERROR,
            payload: error.message
        })
    } else {
        yield put({
            type: CLEAR_EDITOR_CONTENT
        })
        history.push(`/comments/${content.post}`)
    }
}

export function* watchSaveComment() {
    yield takeEvery(SAVE_COMMENT, saveComment)
}

export function* saveEditedComment({ payload: { content, history, id}}) {
    let error = yield firebase.database().ref(`comments/${id}`).update({"content": JSON.stringify(content.content)}).catch(error => error)
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

export function* watchSaveEditedComment() {
    yield takeEvery(SAVE_EDITED_COMMENT, saveEditedComment)
}

// export function* getComments({ payload }) {
//     let error = {}
//     let data = yield firebase.database().ref('comments').orderByChild('post').equalTo(payload.id).once('value').then(snapshot => snapshot.val()).catch(e => error = e)
//     if (error.message) {
//         yield put({
//             type: ERROR,
//             payload: error.message
//         })
//     } else {
//         yield put({
//             type: GET_COMMENTS,
//             payload: _.map(data, (val, id) => { return { id: id, ...val} })
//         })
//     }
// }

// export function* watchGetComments() {
//     yield takeEvery(FETCH_COMMENTS, getComments)
// }

export function getComments({ payload }) {
    const ref = firebase.database().ref('comments')
    return eventChannel(emit => {
        const cb = ref.orderByChild('post').equalTo(payload.id).on('value',
            snapshot => {
                let data = snapshot.val()
                data = _.map(data, (val, id) => { return { id: id, ...val } } )
                emit (data)
            }
        )
        return () => ref.off('value', cb);
    })
}

export function* putComments(payload) {
    yield put({
        type: GET_COMMENTS,
        payload: payload
    })
}

export function* watchCommentsChannel(payload) {
    let channel = yield call(getComments, payload)

    yield takeEvery(channel, putComments)

    yield take(CANCEL_COMMENTS_CHANNEL)
    channel.close()
}

export function* watchGetComments() {
    yield takeLatest(FETCH_COMMENTS, watchCommentsChannel)
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

export function* deleteComment({ payload }) {
    let error = yield firebase.database().ref(`comments/${payload.id}`).remove().catch(error => error)
    if (error && error.messge) {
        yield put({
            type: ERROR,
            payload: error.message
        })
    }
}

export function* watchDeleteComment() {
    yield takeEvery(DELETE_COMMENT, deleteComment)
}