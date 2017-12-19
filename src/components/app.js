import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';

import ScanScreen from './scan/scan-screen';
import SettingsScreen from './settings/settings-screen';


export default class App extends Component {
    render() {

        return (
            <Router>
                <div>
                    <Switch>
                        <Route exact path="/" component={ScanScreen} />
                        <Route exact path="/settings" component={SettingsScreen} />
                    </Switch>
                </div>
            </Router>

        );
    }
}
