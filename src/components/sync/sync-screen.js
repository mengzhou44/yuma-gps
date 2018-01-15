import React, { Component } from "react";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";

import Header from "../_common/header";
import Error from "../_common/error";
import CheckPortal from "../_common/check-portal";
import MyTransition from "../_common/my-transition";


class SyncScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inProgress: false,
            error: "",
            progress: {
                uploadScans: false,
                downloadClients: false,
                downloadTags: false,
                syncDone: false
            }
        }
    }

    resetState() {
        this.setState({
            inProgress: false,
            error: "",
            progress: {
                uploadScans: false,
                downloadClients: false,
                downloadTags: false,
                syncDone: false
            }
        })
    }


    renderSyncButton() {
        const visible = (this.state.inProgress === false);
        return (
            <MyTransition visible={visible}>
                <div className="sync-button-container">
                    <button
                        className="btn btn-block btn-green"
                        onClick={() => {
                            ipcRenderer.send("sync");
                            ipcRenderer.on("sync:progress", (event, result) => {

                                this.setState({
                                    inProgress: true
                                });

                                let progress = this.state.progress;
                                progress.inProgress = true;
                                if (result.error) {
                                    progress.syncDone = true;
                                    this.setState({
                                        progress,
                                        error: result.error
                                    });
                                    ipcRenderer.removeAllListeners("sync:progress");
                                    return;
                                }

                                for (var prop in progress) {
                                    if (result.data.hasOwnProperty(prop)) {
                                        progress[prop] = result.data[prop];
                                    }
                                }

                                if (progress["uploadScans"] &&
                                    progress["downloadClients"] &&
                                    progress["downloadTags"]) {
                                    ipcRenderer.removeAllListeners("sync:progress");
                                    progress.syncDone = true;
                                }

                                this.setState({ progress });

                            });
                        }}
                    >
                        Sync
           </button>
                </div>
            </MyTransition>
        );
    }



    renderCompletedIcon(task) {
        const completed = this.state.progress[task];
        if (completed) {
            return <i className="material-icons">check</i>
        }
    }

    renderDoneButton() {
        if (this.state.progress.syncDone === true) {
            return (
                <button
                    className="btn btn-green btn-block"
                    onClick={() => this.resetState()}
                >
                    Done
                 </button>
            );
        }
    }

    renderError() {
        if (this.state.error) {
            return (
                <li className="collection-item">
                    <Error message={this.state.error} />
                </li>
            );
        }
    }

    renderSyncProgress() {
        const visible = (this.state.inProgress === true);

        return (
            <div className="sync-progress-container">
                <MyTransition visible={visible}>

                    <ul className="collection sync-progress">
                        <li className="collection-item">
                            Upload Scans
                        <a href="#!" className="secondary-content">
                                {this.renderCompletedIcon("uploadScans")}
                            </a>
                        </li>
                        <li className="collection-item">
                            Download Clients
                           <a href="#!" className="secondary-content">
                                {this.renderCompletedIcon("downloadClients")}
                            </a>
                        </li>
                        <li className="collection-item">
                            Download Tags
                               <a href="#!" className="secondary-content">
                                {this.renderCompletedIcon("downloadTags")}
                            </a>
                        </li>
                        {this.renderError()}

                        <li className="collection-item">
                            {this.renderDoneButton()}
                        </li>
                    </ul>
                </MyTransition>
            </div>
        );
    }


    renderScreenContent() {
        if (this.props.portalAvailable === true) {
            return (
                <div className="sync-content">
                    {this.renderSyncButton()}
                    {this.renderSyncProgress()}
                </div>
            );

        }
        return (
            <div>
                <CheckPortal />
            </div>

        );
    }
    render() {

        return (
            <div className="screen">
                <Header />
                <div className="screen-content">
                    {this.renderScreenContent()}
                </div>

            </div>);
    }
}

function mapStateToProps({ checkPortal }) {
    return {
        portalAvailable: checkPortal.available
    }
}

export default connect(mapStateToProps, null)(SyncScreen);

