import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import ScanScreen from './components/scan/scan-screen';
import SettingsScreen from './components/settings/settings-screen';
import reducers from './reducers';

const store = createStore(reducers, {}, applyMiddleware(thunk));

ReactDOM.render(
    <Provider store={store}>
        <SettingsScreen />
    </Provider>,
    document.getElementById('root')
);

