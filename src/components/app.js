import React, { Component } from 'react';
import { BrowserRouter as Router, Route, browserHistory, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { trackUserStatus } from '../actions'
import Header from './header'
import PostList from './post_list'
import Comments from './comments'
import NewPost from './new_post'
import EditPost from './edit_post'
import NewComment from './new_comment'
import EditComment from './edit_comment'
import Login from './login'
import Admin from './admin'

import 'bulma/css/bulma.css'
import 'font-awesome-webpack'

class App extends Component {
  componentDidMount() {
    this.props.trackUserStatus()
  }

  render() {
    return (
      <Router>
        <div className="container">
          <Header />
          <Switch>
            <Route exact path="/" component={PostList} />
            <Route exact path="/comments/:id" component={Comments} />
            <Route exact path="/newpost" component={NewPost} />
            <Route exact path="/editpost/:id" component={EditPost} />
            <Route exact path="/newcomment" component={NewComment} />
            <Route exact path="/editcomment/:id" component={EditComment} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/admin" component={Admin} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default connect(null, { trackUserStatus, })(App)