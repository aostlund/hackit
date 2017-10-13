import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import Post from './post'
import { getPosts, changePostScore } from '../actions'

class PostList extends Component {
    componentWillMount() {
        this.props.getPosts()
    }

    list = () => this.props.posts.sort((a,b) => a.score < b.score ? 1 : -1)
        .map(post => {
            return (
                <div className="box">
                    <Post key={post.id} {...post} changeScore={this.props.changeScore} />
                </div>
            )
    })

    render() {
        return (
            <div className="block">
                {this.list()}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        posts: state.posts,
    }
}

const mapDispatchToProps = {
    getPosts,
    changeScore: changePostScore
}

export default connect(mapStateToProps, mapDispatchToProps)(PostList)