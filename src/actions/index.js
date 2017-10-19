import * as type from './types'

// Post Actions
export function getPost(id) {
    return {
        type: type.FETCH_POST,
        payload: id
    }
}

export function getPosts(payload) {
    return {
        type: type.FETCH_POSTS,
        payload: payload
    }
}

export function savePost(payload) {
    return {
        type: type.SAVE_POST,
        payload: payload
    }
}

export function saveEditedPost(payload) {
    return {
        type: type.SAVE_EDITED_POST,
        payload,
    }
}

export function numPosts() {
    return {
        type: type.GET_NUM_POSTS
    }
}

export function cancelPostChannel() {
    return {
        type: type.CANCEL_POST_CHANNEL
    }
}

export function changePostScore(change) {
    return {
        type: type.CHANGE_POST_SCORE,
        payload: change
    }
} 

export function deletePost(payload) {
    return {
        type: type.DELETE_POST,
        payload,
    }
}

// Comments actions
export function getComment(payload) {
    return {
        type: type.FETCH_COMMENT,
        payload,
    }
}

export function getComments(comment) {
    return {
        type: type.FETCH_COMMENTS,
        payload: comment
    }
}

export function changeCommentScore(change) {
    return {
        type: type.CHANGE_COMMENT_SCORE,
        payload: change
    }
}

export function saveComment(payload) {
    return {
        type: type.SAVE_COMMENT,
        payload: payload
    }
}

export function saveEditedComment(payload) {
    return {
        type: type.SAVE_EDITED_COMMENT,
        payload,
    } 
}

export function cancelCommentsChannel() {
    return {
        type: type.CANCEL_COMMENTS_CHANNEL
    }
}

export function deleteComment(payload) {
    return {
        type: type.DELETE_COMMENT,
        payload,
    }
}

// Auth/User actions
export function loginUser(payload) {
    return {
        type: type.LOGIN_USER,
        payload,
    }
}

export function logoutUser() {
    return {
        type: type.LOGOUT_USER
    }
}

export function signup(payload) {
    return {
        type: type.SIGNUP_USER,
        payload: payload
    }
}

export function getAllUsers() {
    return {
        type: type.FETCH_ALL_USERS
    }
}

export function toggleAdmin(payload) {
    return {
        type: type.TOGGLE_ADMIN,
        payload,
    }
}

export function deleteUser(payload) {
    return {
        type: type.DELETE_USER,
        payload,
    }
}

export function signupGoogle() {
    return {
        type: type.SIGNUP_GOOGLE,
    }
}

// Error actions
export function sendError(payload) {
    return {
        type: type.ERROR,
        payload,
    }
}

// Editor actions
export function updateEditorContent(content) {
    return {
        type: type.UPDATE_EDITOR_CONTENT,
        payload: content
    }
}