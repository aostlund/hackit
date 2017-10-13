import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter as Router } from 'react-router-dom'
import createSagaMiddleware from 'redux-saga'
import firebase from 'firebase'

import App from './components/app';
import reducers from './reducers';
import rootSaga from './sagas'
import config from './config'

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  reducers,
  applyMiddleware(sagaMiddleware)
)

firebase.initializeApp(config)
sagaMiddleware.run(rootSaga)

ReactDOM.render(
  <Provider store={store}>
    <App location={location} />
  </Provider>
  , document.querySelector('.container'));
