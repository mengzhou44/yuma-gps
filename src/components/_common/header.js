import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

class Header extends Component {
    getLinkClass(path) {
        if (this.isCurrentPath(path)) {
            if (path === "/") {
                return "active-link-0 header-menu-item";
            }
            return "active-link header-menu-item";
        }
        else if (this.props.scanStatus !== "not-started") {
            return "header-menu-item-disabled";
        }
        return "header-menu-item";
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

        const disabled = (this.props.scanStatus !== "not-started");
        return (
            <ul className="header-menu">
                <li className={this.getLinkClass("/")} onClick={() =>
                    this.goTo("/")
                } >
                    Scan
                  </li>
                <li className={this.getLinkClass("/sync")} onClick={() => {
                    if (disabled === false) {
                        this.goTo("/sync");
                    }
                }} >
                    Sync
                  </li>

                <li className={this.getLinkClass("/advanced")} onClick={() => {
                    if (disabled === false) {
                        this.goTo("/advanced");
                    }
                }} >
                    Advanced
                </li>

                <li className={this.getLinkClass("/help")} disabled={disabled} onClick={() => {
                    if (disabled === false) {
                        this.goTo("/help");
                    }
                }

                } >
                    Help
                </li>

            </ul>
        );
    }
}

function mapStateToProps({ scan }) {
    return {
        scanStatus: scan.status
    };
}


export default connect(mapStateToProps, null)(withRouter(Header));
