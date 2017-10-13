import { combineReducers } from 'redux';
import posts from './posts'
import comments from './comments'
import editorContent from './editor'
import user from './user'
import error from './error'

const rootReducer = combineReducers({
  posts,
  comments,
  editorContent,
  user,
  error,
});

export default rootReducer;
