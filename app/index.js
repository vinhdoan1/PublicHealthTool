var React = require('react');
var ReactDOM = require('react-dom');
require('./index.css');
require('./mobile.css');
var App = require('./components/App');
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'

const store = createStore(reducer)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
