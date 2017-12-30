import React, { Component } from "react";
import { connect } from "react-redux";

class ScanProgress extends Component {

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
                    <button className="btn btn-green" >
                        Uncontaminated
                </button>
                    <button className="btn btn-red" >
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


        return (<div className="scan-progress-contamination">
            <div className="scan-progress-contamination-processed">
                <span className="scan-progress-processed">{processed}</span>
                <span className="scan-progress-processed-found">&nbsp;Mats Processed</span>
            </div>
            <div className="scan-progress-contamination-mats">
                <span className="scan-progress-mats">{mats}</span>
                <span className="scan-progress-mats-found">&nbsp;Mats Found</span>
            </div>
            {this.renderContaminationButtons()}
        </div>);
    }

    render() {
        console.log("this.props.contaminationJob", this.props.contaminationJob);
        if (this.props.contaminationJob === false) {
            return this.renderProgress();
        }

        return this.renderContaminationProgress();
    }
}

function mapStateToProps({ scan }) {
    return {
        progress: scan.progress,
        contaminationJob: scan.contaminationJob
    }
}

export default connect(mapStateToProps, null)(ScanProgress);