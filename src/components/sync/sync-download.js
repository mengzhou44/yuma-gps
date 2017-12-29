import React, { Component } from "react";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";
import { Divider } from "semantic-ui-react";

import MyTransition from "../_common/my-transition";
import Error from "../_common/error";
import MyAlert from "../_common/my-alert";

class SyncDownload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inProgress: false,
            showAlert: false,
            alertMessage: "",
            error: ""
        };
    }

    renderDonwloadContent() {
        if (this.props.scans.length > 0) {
            return (
                <div>
                    <label className="font-size-16">Scanned data is found. Please upload data first. </label>
                </div>
            );
        }

        let downloadButtonText = "Download jobs";
        let downloadButtonDisabled = false;
        if (this.state.inProgress) {
            downloadButtonText = "Downloading ...";
            downloadButtonDisabled = true;
        }

        return (<div className="sync-download">
            <div className="width-100-100">
                <button
                    className="btn btn-block btn-green"
                    disabled={downloadButtonDisabled}
                    onClick={() => {
                        this.setState({
                            error: "",
                            inProgress: true
                        });
                        ipcRenderer.send("clients:download");
                        ipcRenderer.once("clients:download", (event, error) => {
                            if (error) {
                                this.setState({
                                    inProgress: false,
                                    error
                                });
                            } else {
                                this.setState({
                                    inProgress: false,
                                    showAlert: true,
                                    alertMessage: "Download is complete!"
                                });
                            }
                        })
                    }}
                >
                    {downloadButtonText}
                </button>
                <Error message={this.state.error} />

                <MyAlert
                    showAlert={this.state.showAlert}
                    message={this.state.alertMessage}
                    onClick={() =>
                        this.setState({
                            showAlert: false
                        })
                    }
                />
            </div>
        </div>
        );

    }

    render() {
        const visible = this.props.current === "download";
        return (
            <MyTransition visible={visible}>
                <div className="sidebar-content">
                    <h5 className="color-orange">Download</h5>
                    <Divider />
                    {this.renderDonwloadContent()}
                </div>
            </MyTransition>
        );
    }
}

function mapStateToProps({ sync }) {
    return {
        scans: sync.scans
    }
}

export default connect(mapStateToProps, null)(SyncDownload);

