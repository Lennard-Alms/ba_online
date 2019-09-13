import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import allReducers from './reducers';
require('./styles/style.scss');
import App from './components/app';

const store = createStore(allReducers);

ReactDOM.render(<Provider store={store}>
                  <App />
                </Provider>, document.getElementById('root'));
 
