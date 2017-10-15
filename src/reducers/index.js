import { combineReducers } from 'redux';
import posts from './posts'
import comments from './comments'
import editorContent from './editor'
import user from './user'
import error from './error'
import users from './users'

const rootReducer = combineReducers({
  posts,
  comments,
  editorContent,
  user,
  error,
  users,
});

export default rootReducer;
