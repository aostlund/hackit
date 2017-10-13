import { 
    GET_POSTS,
    CHANGE_POST_SCORE,
    GET_COMMENTS,
    GET_CHILD_COMMENTS,
    CHANGE_COMMENT_SCORE,
    CHANGE_CHILD_COMMENT_SCORE,
    DELAYED_GET_POSTS,
    UPDATE_EDITOR_CONTENT,
    SAVE_POST,
    SAVE_EDITED_POST,
    FETCH_POST,
    SAVE_COMMENT,
    SAVE_EDITED_COMMENT,
    FETCH_COMMENTS,
    FETCH_COMMENT,
    TRACK_USER_STATUS,
    LOGIN_USER,
    LOGOUT_USER,
    SIGNUP_USER,
    ERROR
} from './types'

export function getPosts() {
    return {
        type: DELAYED_GET_POSTS,
        payload: [
            {
                title: 'Test',
                link: 'http://test.link',
                id: 0,
                score: 5,
                info: 'Test text'
            },
            {
                title: 'Second Test',
                link: 'http://test2.link',
                id: 1,
                score: 10,
                info: 'video'
            },
            {
                title: 'Third Test',
                link: 'http://test3.link',
                id: 3,
                score: -3,
                info: 'useless'
            }
        ]
    }
}
export function getPost(id) {
    return {
        type: FETCH_POST,
        payload: id
    }
}
export function changePostScore(change) {
    return {
        type: CHANGE_POST_SCORE,
        payload: change
    }
} 
export function getComments(comment) {
    return {
        type: FETCH_COMMENTS,
        payload: comment
    }
}
export function getComment(payload) {
    return {
        type: FETCH_COMMENT,
        payload,
    }
}
export function changeCommentScore(change) {
    return {
        type: CHANGE_COMMENT_SCORE,
        payload: change
    }
}
export function updateEditorContent(content) {
    return {
        type: UPDATE_EDITOR_CONTENT,
        payload: content
    }
}
export function savePost(payload) {
    return {
        type: SAVE_POST,
        payload: payload
    }
}
export function saveEditedPost(payload) {
    return {
        type: SAVE_EDITED_POST,
        payload,
    }
}
export function saveComment(payload) {
    return {
        type: SAVE_COMMENT,
        payload: payload
    }
}

export function saveEditedComment(payload) {
    return {
        type: SAVE_EDITED_COMMENT,
        payload,
    } 
}

export function trackUserStatus() {
    return {
        type: TRACK_USER_STATUS
    }
}

export function loginUser(payload) {
    return {
        type: LOGIN_USER,
        payload,
    }
}

export function logoutUser() {
    return {
        type: LOGOUT_USER
    }
}

export function signup(payload) {
    return {
        type: SIGNUP_USER,
        payload: payload
    }
}

export function sendError(payload) {
    return {
        type: ERROR,
        payload,
    }
}