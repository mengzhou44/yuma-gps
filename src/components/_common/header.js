import React, { Component } from 'react';
import { withRouter } from 'react-router';

class Header extends Component {
    getLinkClass(path) {
        if (this.isCurrentPath(path)) {
            if (path === "/") {
                return 'active-link-0 header-menu-item';
            }
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
                <li className={this.getLinkClass('/upload')} onClick={() =>
                    this.goTo('/upload')
                } >
                    Upload
                  </li>

                <li className={this.getLinkClass('/advanced')} onClick={() =>
                    this.goTo('/advanced')
                } >
                    Advanced
                </li>

                <li className={this.getLinkClass('/help')} onClick={() =>
                    this.goTo('/help')
                } >
                    Help
                </li>

            </ul>
        );
    }
}


export default withRouter(Header);
