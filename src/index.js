import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import allReducers from './reducers';
require('./styles/style.scss');
import App from './components/app';
import thunk from 'redux-thunk';

const store = createStore(allReducers, applyMiddleware(thunk));

ReactDOM.render(<Provider store={store}>
                  <App />
                </Provider>, document.getElementById('root'));
