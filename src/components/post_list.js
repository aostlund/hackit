import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import Post from './post'
import { getPosts, changePostScore, numPosts, cancelPostChannel } from '../actions'

class PostList extends Component {
    state = {
        start: 'Z', // start to be last index
        perPage: 5, // num posts per page
        score: 999999999999, // score set high enough to get all posts
        prevStart: [],
        prevScore: []
    }

    componentWillMount() {
        this.props.cancelPostChannel()
        this.props.getPosts({start: this.state.start, perPage: this.state.perPage, score: this.state.score })
    }

    // Lists posts
    list = () => this.props.posts.posts.sort((a,b) => a.score < b.score ? 1 : -1)
        .map(post => {
            return (
                <div key={post.id} className="box">
                    <Post {...post} changeScore={this.props.changeScore} />
                </div>
            )
    })

    // Get previous page
    getPrev = () => {
        this.props.cancelPostChannel() // cancel channel as the current channels post is not wanted on new page
        // prevStart and prevScore works as a stack so we pop it off when we go backwards
        this.props.getPosts({start: this.state.prevStart.slice(-1)[0], score: this.state.prevScore.slice(-1)[0], perPage: this.state.perPage })
        // Doing the right thing in React makes us do this update the complicated way.
        // The wrong way should be to use pop(), but that works inplace and mutates data.
        this.setState({
            prevStart: this.state.prevStart.slice(0, -1),
            prevScore: this.state.prevScore.slice(0, -1),
            start: this.state.prevStart.slice(-1)[0],
            score: this.state.prevScore.slice(-1)[0]
        })
    }

    // Get next page
    getNext = () => {
        this.props.cancelPostChannel()
        let posts = this.props.posts.posts.sort((a,b) => a.score < b.score ? 1 : -1)
        // We need to set start and score to the highest start and score.
        // Becuase the sorting is back to front we need the highest post that has the same values as the last of the set.
        for (let i = 0; i <= posts.length; i++) {
            if (posts[i].score === posts[posts.length-1].score) {
                this.props.getPosts({start: posts[i].id.slice(0, -1), perPage: this.state.perPage, score: posts[i].score })
                this.setState({
                    prevStart: [...this.state.prevStart, this.state.start],
                    prevScore: [...this.state.prevScore, this.state.score],
                    start: posts[i].id.slice(0, -1),
                    score: posts[i].score
                })
                break
            }
        }
    }

    // If prevStart stack isn't empty we show previous link
    prevLink = () => {
        if (this.state.prevStart.length > 0) {
            return <a onClick={this.getPrev}>Previous</a>
        }
    }

    // As long as we have the same amount of posts per page as we should show Next link
    // (Of course the last posts fill a page we show a link to nothing. Needs fix)
    nextLink = () => {
        if (this.props.posts.posts.length === this.state.perPage) {
            return <a onClick={this.getNext}>Next</a>
        }
    }

    render() {
        if (this.props.posts.posts) {
            return (
                <div className="block">
                    {this.list()}
                    {this.prevLink()}
                    <span>  </span>
                    {this.nextLink()}
                </div>
            )
        } else {
            return <div/>
        }
    }
}

function mapStateToProps(state) {
    return {
        posts: state.posts,
        user: state.user
    }
}

const mapDispatchToProps = {
    getPosts,
    changeScore: changePostScore,
    numPosts,
    cancelPostChannel,
}

export default connect(mapStateToProps, mapDispatchToProps)(PostList)