import React, { Component } from "react";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";
import moment from "moment";
import { Divider } from "semantic-ui-react";

import * as actions from "../../actions";
import Error from "../_common/error";
import Header from "../_common/header";
import MyAlert from "../_common/my-alert";
import CheckPortal from "./check-portal";



class SyncScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            current: "upload",
            inProgress: false,
            showAlert: false,
            alertMessage: "",
            error: ""
        };
    }

    componentDidMount() {
        this.props.getScans();
    }

    getSideBarLinkClass(link) {
        if (this.state.current === link) {
            return 'collection-item sync-active-link';
        }
        return 'collection-item';
    }

    renderSideBar() {
        return (
            <ul className="collection sync-sidebar">
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



    renderDownloadContent() {

        let downloadButtonText = "Download jobs";
        let downloadButtonDisabled = false;
        if (this.state.current === "download" && this.state.inProgress) {
            downloadButtonText = "Downloading ...";
            downloadButtonDisabled = true;
        }

        return (
            <div className="sync-content">
                <h5 className="color-orange">Download</h5>
                <Divider />
                <button
                    className="btn btn-block btn-green margin-top-100"
                    disabled={downloadButtonDisabled}
                    onClick={() => {
                        this.setState({
                            current: "download",
                            error: "",
                            inProgress: true
                        });
                        ipcRenderer.send("clients:download");
                        ipcRenderer.once("clients:download", (event, error) => {
                            if (error) {

                                this.setState({
                                    current: "download",
                                    inProgress: false,
                                    error
                                });
                            } else {
                                this.setState({
                                    current: "download",
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
            </div>
        );

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
    renderUploadContent() {
        let uploadButtonText = "Upload Scans";
        let uploadButtonDisabled = false;
        if (this.state.current === "upload" && this.state.inProgress) {
            uploadButtonText = "Uploading ...";
            uploadButtonDisabled = true;
        }

        if (this.props.scans.length === 0) {
            return (
                <div className="sync-content">
                    <h5 className="color-orange">Upload</h5>
                    <Divider />

                    <p className="margin-top-20">No Data to Upload </p>
                </div>
            );

        }
        return (
            <div className="sync-content">
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
                                    current: "upload",
                                    inProgress: true,
                                    error: ""
                                });
                                ipcRenderer.send("scans:upload");
                                ipcRenderer.once("scans:upload", (event, error) => {
                                    if (error) {
                                        this.setState({
                                            current: "upload",
                                            inProgress: false,
                                            error
                                        });

                                    } else {
                                        this.props.getScans();
                                        this.setState({
                                            current: "upload",
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
                    </div>
                </div>
            </div>
        );
    }

    renderContent() {
        switch (this.state.current) {
            case 'download':
                return this.renderDownloadContent();
            case 'upload':
                return this.renderUploadContent();
            default:
                return this.renderDownloadContent();
        }
    }

    renderScreenContent() {
        return (
            <div className="row">
                <div className="col s12 m3">{this.renderSideBar()}</div>
                <div className="col s12 m9">{this.renderContent()}</div>
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

function mapStateToProps(state) {
    return {
        scans: state.sync.scans,
        portalAvailable: state.checkPortal.available
    }
}

export default connect(mapStateToProps, actions)(SyncScreen);

