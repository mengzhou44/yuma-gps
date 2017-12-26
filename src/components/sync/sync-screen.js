import React, { Component } from "react";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";

import * as actions from "../../actions";
import Error from "../_common/error";
import Header from "../_common/header";
import MyAlert from "../_common/my-alert";
import CheckPortal from "./check-portal";


class SyncScreen extends Component {

    componentDidMount() {
        this.props.getScans();
    }

    constructor(props) {
        super(props);
        this.state = {
            mode: "",
            inProgress: false,
            showAlert: false,
            alertMessage: ""
        }
    }

    renderDownloadSection() {

        let downloadButtonText = "Download jobs";
        let downloadButtonDisabled = false;
        if (this.state.mode === "download" && this.state.inProgress) {
            downloadButtonText = "Downloading ...";
            downloadButtonDisabled = true;
        }

        return (
            <div className="sync-download">
                <div className="sync-title">
                    Download
            </div>
                <div className="height-20" />
                <button
                    className='btn btn-block btn-blue'
                    disabled={downloadButtonDisabled}
                    onClick={() => {
                        this.setState({
                            mode: 'download',
                            inProgress: true
                        });
                        ipcRenderer.send("clients:download");
                        ipcRenderer.once("clients:download", () => {
                            this.setState({
                                mode: "download",
                                inProgress: false,
                                showAlert: true,
                                alertMessage: "Download is complete!"
                            });

                        })
                    }}
                >
                    {downloadButtonText}
                </button>
                <div className="height-20" />
            </div>
        );

    }


    renderScan(scan) {
        return (
            <div
                className="collection-item"
                key={scan.clientId}
            >
                {scan.clientId}  - {scan.jobId}
            </div>
        );

    }
    renderUploadSection() {
        return (
            <div className="sync-upload">
                <div className="sync-title">
                    Upload
                </div>
                <div className="collection">
                    {this.props.scans.map(this.renderScan)}
                </div>
            </div>
        );
    }

    renderContent() {
        return (
            <div>
                {this.renderDownloadSection()}

                {this.renderUploadSection()}

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
    render() {
        console.log("portalAvailable", this.props.portalAvailable);

        if (this.props.portalAvailable === true) {
            return (
                <div>
                    <Header />
                    {this.renderContent()}
                </div>);

        }

        return (
            <div>
                <Header />
                <CheckPortal />
            </div>);
    }
}

function mapStateToProps(state) {
    console.log(JSON.stringify(state.checkPortal, null, 4));
    return {
        scans: state.sync.scans,
        portalAvailable: state.checkPortal.available
    }
}

export default connect(mapStateToProps, actions)(SyncScreen);

