import React, { Component } from "react";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";

import * as actions from "../../actions";

class ScanProgress extends Component {


    componentDidMount() {
        this.props.fetchSettings();
    }

    renderProgress() {
        let mats = 0;
        if (this.props.progress.processed) {
            mats = this.props.progress.processed;
        }

        return (<div className="scan-progress-mats-container">
            <span className="scan-progress-mats">{mats}</span>
            <span className="scan-progress-mats-found">&nbsp;Mats Found</span>
        </div>);
    }

    renderContaminationButtons() {
        if (this.props.progress.batchFull) {

            return (
                <div className="scan-progress-contamination-buttons">
                    <button
                        className="btn btn-green"
                        onClick={() => {
                            ipcRenderer.send("batch:process", { contaminated: true });
                        }}

                    >
                        Uncontaminated
                </button>
                    <button
                        className="btn btn-red"
                        onClick={() => {
                            ipcRenderer.send("batch:process", { contaminated: false });
                        }}
                    >
                        Contaminated
                </button>
                </div>
            );
        }
    }

    renderContaminationProgress() {

        let processed = 0;
        let mats = 0;
        if (this.props.progress.processed) {
            processed = this.props.progress.processed;
        }
        if (this.props.progress.batch) {
            mats = this.props.progress.batch;
        }

        let rssiThreshold = 0;
        if (this.props.settings.contamination) {
            rssiThreshold = this.props.settings.contamination.rssiThreshold;
        }

        return (<div className="scan-progress-contamination">
            <div className="scan-progress-contamination-processed">
                <span className="scan-progress-processed">{processed}</span>
                <span className="scan-progress-processed-found">&nbsp;Mats Processed</span>
            </div>
            <div className="scan-progress-contamination-mats">
                <span className="scan-progress-mats">{mats}</span>
                <span className="scan-progress-mats-found">&nbsp;Mats Found (rssi > {rssiThreshold})</span>
            </div>
            {this.renderContaminationButtons()}
        </div>);
    }

    render() {
        if (this.props.contaminationJob === false) {
            return this.renderProgress();
        }

        return this.renderContaminationProgress();
    }
}

function mapStateToProps({ scan, settings }) {

    return {
        progress: scan.progress,
        contaminationJob: scan.contaminationJob,
        settings: settings.data
    }
}


export default connect(mapStateToProps, actions)(ScanProgress);