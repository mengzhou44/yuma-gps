import React, { Component } from "react";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";
import { Divider } from "semantic-ui-react";

import * as actions from "../../actions";
import Error from "../_common/error";
import MyAlert from "../_common/my-alert";

class SyncUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inProgress: false,
            showAlert: false,
            alertMessage: "",
            error: ""
        };
    }

    componentDidMount() {
        this.props.getScans();
    }

    render() {
        let uploadButtonText = "Upload Scans";
        let uploadButtonDisabled = false;
        if (this.state.inProgress) {
            uploadButtonText = "Uploading ...";
            uploadButtonDisabled = true;
        }

        if (this.props.scans.length === 0) {
            return (

                <div className="sidebar-content">
                    <h5 className="color-orange">Upload</h5>
                    <Divider />

                    <p className="margin-top-20">No Data to Upload </p>
                </div>
            );

        }
        return (

            <div className="sidebar-content">
                <h5 className="color-orange">Upload</h5>
                <Divider />
                <div className="sync-upload-content">
                    <div className="collection">
                        {this.props.scans.map(this.renderScan)}
                    </div>
                    <div>
                        <button
                            className="btn btn-block btn-green"
                            disabled={uploadButtonDisabled}
                            onClick={() => {
                                this.setState({
                                    inProgress: true,
                                    error: ""
                                });
                                ipcRenderer.send("scans:upload");
                                ipcRenderer.once("scans:upload", (event, error) => {
                                    if (error) {
                                        this.setState({
                                            inProgress: false,
                                            error
                                        });

                                    } else {
                                        this.props.getScans();
                                        this.setState({
                                            inProgress: false,
                                            showAlert: true,
                                            alertMessage: "Upload is complete!"
                                        });
                                    }
                                })
                            }}
                        >
                            {uploadButtonText}
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
            </div>
        );
    }
}

function mapStateToProps({ sync }) {
    return {
        scans: sync.scans
    }
}

export default connect(mapStateToProps, actions)(SyncUpload);

