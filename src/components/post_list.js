import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import Post from './post'
import { getPosts, changePostScore, numPosts, cancelPostChannel } from '../actions'

class PostList extends Component {
    state = {
        start: 'Z',
        perPage: 5, 
        score: 999999999999,
        prevStart: [],
        prevScore: []
    }

    componentWillMount() {
        this.props.getPosts({start: this.state.start, perPage: this.state.perPage, score: this.state.score })
        this.props.numPosts()
    }

    list = () => this.props.posts.posts.sort((a,b) => a.score < b.score ? 1 : -1)
        .map(post => {
            return (
                <div className="box">
                    <Post key={post.id} {...post} changeScore={this.props.changeScore} />
                </div>
            )
    })

    getPrev = () => {
        this.props.cancelPostChannel()
        this.props.getPosts({start: this.state.prevStart.slice(-1)[0], score: this.state.prevScore.slice(-1)[0], perPage: this.state.perPage })
        this.setState({
            prevStart: this.state.prevStart.slice(0, -1),
            prevScore: this.state.prevScore.slice(0, -1),
            start: this.state.prevStart.slice(-1)[0],
            score: this.state.prevScore.slice(-1)[0]
        })
    }

    getNext = () => {
        this.props.cancelPostChannel()
        let x = this.props.posts.posts.sort((a,b) => a.score < b.score ? 1 : -1)
        for (let i = 0; i <= x.length; i++) {
            if (x[i].score === x[x.length-1].score) {
                this.props.getPosts({start: x[i].id.slice(0, -1), perPage: this.state.perPage, score: x[i].score })
                this.setState({
                    prevStart: [...this.state.prevStart, this.state.start],
                    prevScore: [...this.state.prevScore, this.state.score],
                    start: x[i].id.slice(0, -1),
                    score: x[i].score
                })
                break
            }
        }
    }

    prevLink = () => {
        if (this.state.prevStart.length > 0) {
            return <a onClick={this.getPrev}>Previous</a>
        }
    }

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