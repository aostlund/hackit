
import React, { Component } from 'react'
import { connect } from 'react-redux'

export default function(ComposedComponent) {
    class Loading extends Component {

        render() {
                return (
                <div>
                    <div className={`modal ${this.props.loading > 0 ? 'is-active' : ''}`} style={{textAlign: 'left !important'}}>
                        <div className="modal-background"></div>
                        <div className="modal-card lds-ripple">
                            <section className="modal-card-body" style={{backgroundColor: 'rgba(10,10,10, 0.0)' }} >
                                <div style={{width: '100px', heigth: '100px', color: '#FFF'}}>
                                    LOADING...
                                </div>
                            </section>
                        </div>
                    </div>
                    <ComposedComponent {...this.props} />
                </div>
                )
        }
    }

    const mapStateToProps = state => {
        return {
            loading: state.loading
        }
    }

    return connect(mapStateToProps)(Loading)
}