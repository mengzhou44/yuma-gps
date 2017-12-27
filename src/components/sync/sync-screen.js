import React, { Component } from "react";
import { connect } from "react-redux";


import Header from "../_common/header";
import CheckPortal from "../_common/check-portal";
import SyncDownload from "./sync-download";
import SyncUpload from "./sync-upload";


class SyncScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            current: "upload"
        };
    }

    getSideBarLinkClass(link) {
        if (this.state.current === link) {
            return 'collection-item active-link';
        }
        return 'collection-item';
    }

    renderSideBar() {
        return (
            <ul className="collection sidebar">
                <li
                    className={this.getSideBarLinkClass('upload')}
                    onClick={() => this.setState({ current: 'upload' })}
                >
                    Upload
            </li>
                <li
                    className={this.getSideBarLinkClass('download')}
                    onClick={() => this.setState({ current: 'download' })}
                >
                    Download
            </li>

            </ul>
        );
    }

    renderContent() {
        switch (this.state.current) {
            case 'download':
                return <SyncDownload />;
            case 'upload':
                return <SyncUpload />;
            default:
                return <SyncDownload />;
        }
    }

    renderScreenContent() {
        return (
            <div className="row">
                <div className="col s12 m3">{this.renderSideBar()}</div>
                <div className="col s12 m9">{this.renderContent()}</div>
            </div>
        );
    }

    render() {
        if (this.props.portalAvailable === true) {
            return (
                <div>
                    <Header />
                    {this.renderScreenContent()}
                </div>);

        }

        return (
            <div>
                <Header />
                <CheckPortal />
            </div>);
    }
}

function mapStateToProps({ checkPortal }) {
    return {
        portalAvailable: checkPortal.available
    }
}

export default connect(mapStateToProps, null)(SyncScreen);

