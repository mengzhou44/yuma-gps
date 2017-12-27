import React, { Component } from "react";
import { ipcRenderer } from "electron";
import { Divider } from "semantic-ui-react";

import Error from "../_common/error";
import MyAlert from "../_common/my-alert";

export default class SyncDownload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inProgress: false,
            showAlert: false,
            alertMessage: "",
            error: ""
        };
    }

    render() {
        let downloadButtonText = "Download jobs";
        let downloadButtonDisabled = false;
        if (this.state.inProgress) {
            downloadButtonText = "Downloading ...";
            downloadButtonDisabled = true;
        }

        return (
            <div className="sidebar-content">
                <h5 className="color-orange">Download</h5>
                <Divider />
                <button
                    className="btn btn-block btn-green margin-top-100"
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
        );
    }
}

