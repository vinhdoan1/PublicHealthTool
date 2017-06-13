var React = require('react');
var ReactDOM = require('react-dom');
require('./index.css');
require('./mobile.css');
var App = require('./components/App');

import { applyMiddleware, compose, createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
import {persistStore, autoRehydrate} from 'redux-persist'

const store = createStore(
  reducer,
  undefined,
  compose(
    applyMiddleware(),
    autoRehydrate()
  )
)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);

persistStore(store)
