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

import 'bulma/css/bulma.css'
import 'font-awesome-webpack'

export default class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <Header />
          <Switch>
            <Route exact path="/" component={PostList} />
            <Route exact path="/comments/:id" component={Comments} />
            <Route exact path="/newpost" component={RequireAuth(NewPost)} />
            <Route exact path="/editpost/:id" component={RequireAuth(EditPost)} />
            <Route exact path="/newcomment" component={RequireAuth(NewComment)} />
            <Route exact path="/editcomment/:id" component={RequireAuth(EditComment)} />
            <Route exact path="/admin" component={RequireAdminAuth(Admin)} />
          </Switch>
        </div>
      </Router>
    );
  }
}