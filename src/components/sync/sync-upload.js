import React, { Component } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";
import { Divider } from "semantic-ui-react";

import MyTransition from "../_common/my-transition";
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

    renderScan(scan) {
        const jobDate = moment(scan.created).format("MMM DD, YYYY     HH:mm");
        return (
            <div
                className="collection-item"
                key={scan.created}
            >
                <div>{jobDate} </div>
                <div className="sync-scan-detail">
                    <div>{scan.clientName} </div>
                    <div> {scan.jobName} </div>
                </div>
            </div>
        );
    }

    render() {
        let uploadButtonText = "Upload Scans";
        let uploadButtonDisabled = false;
        if (this.state.inProgress) {
            uploadButtonText = "Uploading ...";
            uploadButtonDisabled = true;
        }

        const visible = this.props.current === "upload";

        if (this.props.scans.length === 0) {

            return (
                <MyTransition visible={visible}>
                    <div className="sidebar-content">
                        <h5 className="color-orange">Upload</h5>
                        <Divider />

                        <p className="margin-top-20">No Data to Upload </p>
                    </div>
                </MyTransition>
            );

        }
        return (
            <MyTransition visible={visible}>
                <div className="sidebar-content">
                    <h5 className="color-orange">Upload</h5>
                    <Divider />
                    <div className="sync-upload-content">
                        <div className="collection">
                            {this.props.scans.map(this.renderScan)}
                        </div>
                        <div>
                            <button
                                className="btn btn-block btn-green margin-top-10"
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
            </MyTransition>
        );
    }
}

function mapStateToProps({ sync }) {
    return {
        scans: sync.scans
    }
}

export default connect(mapStateToProps, actions)(SyncUpload);

