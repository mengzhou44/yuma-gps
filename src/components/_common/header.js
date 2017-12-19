import React, { Component } from 'react';
import { withRouter } from 'react-router';

class Header extends Component {
    getLinkClass(link) {
        if (link === this.props.location.pathname) {
            return 'active-link';
        }

        return '';
    }

    render() {

        return (
            <ul className="header-menu">
                <li className={this.getLinkClass('/')} onClick={() => this.props.history.push('/')}>
                    Scan
                  </li>

                <li className={this.getLinkClass('/settings')} onClick={() => this.props.history.push('/settings')}>
                    Settings
              </li>

            </ul>
        );
    }
}


export default withRouter(Header);
