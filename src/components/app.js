import React, { Component } from 'react';
import { BrowserRouter as Router, Route, browserHistory, Switch, withRouter } from 'react-router-dom'
import Header from './header'
import PostList from './post_list'
import Comments from './comments'
import NewPost from './new_post'
import EditPost from './edit_post'
import NewComment from './new_comment'
import EditComment from './edit_comment'
import Admin from './admin'

import RequireAuth from './HOCs/require_auth'
import RequireAdminAuth from './HOCs/require_admin'
import Loading from './HOCs/loading'

import 'bulma/css/bulma.css'
import 'font-awesome-webpack'

export default class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <Header />
          <Switch>
            <Route exact path="/" component={Loading(PostList)} />
            <Route exact path="/comments/:id" component={Loading(Comments)} />
            <Route exact path="/newpost" component={RequireAuth(Loading(NewPost))} />
            <Route exact path="/editpost/:id" component={RequireAuth(Loading(EditPost))} />
            <Route exact path="/newcomment" component={RequireAuth(Loading(NewComment))} />
            <Route exact path="/editcomment/:id" component={RequireAuth(Loading(EditComment))} />
            <Route exact path="/admin" component={RequireAdminAuth(Loading(Admin))} />
          </Switch>
        </div>
      </Router>
    );
  }
}