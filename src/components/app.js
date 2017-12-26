import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';

import ScanScreen from './scan/scan-screen';
import SyncScreen from './sync/sync-screen';
import AdvancedScreen from './advanced/advanced-screen';
import HelpScreen from './help/help-screen';


export default class App extends Component {
    render() {
        return (
            <Router>

                <Switch>
                    <Route exact path="/" component={ScanScreen} />
                    <Route exact path="/sync" component={SyncScreen} />
                    <Route exact path="/advanced" component={AdvancedScreen} />
                    <Route exact path="/help" component={HelpScreen} />
                </Switch>

            </Router>

        );
    }
}
