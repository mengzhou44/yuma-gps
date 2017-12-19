import React, { Component } from 'react';
import { withRouter } from 'react-router';

class Header extends Component {
    getLinkClass(path) {
        if (this.isCurrentPath(path)) {
            return 'active-link header-menu-item';
        }
        return 'header-menu-item';
    }

    isCurrentPath(path) {
        return this.props.location.pathname == path;
    }

    goTo(path) {
        if (!this.isCurrentPath(path)) {
            this.props.history.push(path);
        }
    }

    render() {
        return (
            <ul className="header-menu">
                <li className={this.getLinkClass('/')} onClick={() =>
                    this.goTo('/')
                } >
                    Scan
                  </li>

                <li className={this.getLinkClass('/settings')} onClick={() =>
                    this.goTo('/settings')
                } >
                    Settings
                </li>

            </ul>
        );
    }
}


export default withRouter(Header);
