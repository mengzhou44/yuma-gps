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


    renderContaminationProgress() {
        return <div> Contamination Progress </div>;
    }

    render() {
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