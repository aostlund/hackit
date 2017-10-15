import { all } from 'redux-saga/effects'

import * as Posts from './posts'
import * as Comments from './comments'
import * as Auth from './auth'
import * as error from './error'
import * as users from './users'



export default function* rootSaga() {
    yield all([
        Posts.watchDelayedGet(),
        Posts.watchChangePostScore(),
        Posts.watchSavePost(),
        Posts.watchSaveEditedPost(),
        Posts.watchFetchPost(),
        Posts.watchNumPosts(),
        Comments.watchChangeCommentScore(),
        Comments.watchSaveComment(),
        Comments.watchSaveEditedComment(),
        Comments.watchGetComments(),
        Comments.watchGetComment(),
        Auth.watchTrackUserStatus(),
        Auth.watchLoginUser(),
        Auth.watchLogoutUser(),
        Auth.watchSignupUser(),
        error.watchClearError(),
        users.watchFetchAllUsers(),
        users.watchToggleAdmin(),
        users.watchDeleteUser()
    ])
}