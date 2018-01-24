import React, { Component } from "react";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";
import Error from "../_common/error";

import * as actions from "../../actions";

class ScanProgressContamination extends Component {

    render() {

        if (this.props.jobType !== "contamination") {
            return <span />;
        }

        const { error } = this.props.progress;

        if (error) {

            return (
                <Error message={error} />
            );
        }

        let mats = 0;
        let contaminated = 0;
        let decontaminated = 0;
        let matsInRange = 0;
        let tagsInRange = "";

        if (this.props.progress.found) {
            mats = this.props.progress.found;
        }

        if (this.props.progress.inRange) {
            matsInRange = this.props.progress.inRange;
        }

        if (this.props.progress.tagsInRange) {
            tagsInRange = this.props.progress.tagsInRange
        }

        if (this.props.progress.contamination) {
            contaminated = this.props.progress.contamination.contaminated;
            decontaminated = this.props.progress.contamination.decontaminated;
        }

        return (<div className="scan-progress">
            <div className="scan-progress-summary-container">
                <div className="scan-progress-summary-mats">
                    <span className="scan-progress-mats">{mats}</span>
                    <span className="scan-progress-mats-found">&nbsp;Mats Found</span>
                </div>
                <div className="scan-progress-summary-decontaminated">
                    <span className="scan-progress-mats">{decontaminated}</span>
                    <span className="scan-progress-mats-found">&nbsp;Decontaminated</span>
                </div>
                <div className="scan-progress-summary-contaminated">
                    <span className="scan-progress-mats">{contaminated}</span>
                    <span className="scan-progress-mats-found">&nbsp;Contaminated</span>
                </div>
            </div>
            <div className="scan-progress-inrange">
                <div>
                    <span className="scan-progress-inrange-mats">{matsInRange}</span>
                    <span className="scan-progress-mats-found">&nbsp;Mats In Range</span>
                </div>
                <div className="height-40">
                    <p className="margin-top-10">
                        {tagsInRange}
                    </p>
                </div>

                <div className="scan-progress-buttons">
                    <div className="margin-lr-40">
                        <button
                            className="btn btn-green"
                            onClick={() => {
                                ipcRenderer.send("batch:process", { contaminated: false });
                            }}

                        >
                            Decontaminated
                   </button>
                    </div>
                    <div className="margin-lr-40">
                        <button
                            className="btn btn-red"
                            onClick={() => {
                                ipcRenderer.send("batch:process", { contaminated: true });
                            }}
                        >
                            Contaminated
                </button>
                    </div>
                </div>
            </div>
        </div>

        );
    }
}

function mapStateToProps({ scan }) {
    return {
        progress: scan.progress,
        jobType: scan.jobType
    }
}


export default connect(mapStateToProps, actions)(ScanProgressContamination);