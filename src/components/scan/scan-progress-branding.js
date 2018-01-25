import React, { Component } from "react";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";
import Error from "../_common/error";

import * as actions from "../../actions";

class ScanProgressBranding extends Component {

    render() {

        if (this.props.jobType !== "branding") {
            return <span />;
        }

        const { error } = this.props.progress;

        if (error) {

            return (
                <Error message={error} />
            );
        }

        let matsBranded = 0;
        let matsInRange = "";
        let numberOfMatsInRange = 0;

        if (this.props.progress.matsBranded) {
            matsBranded = this.props.progress.matsBranded;
        }

        if (this.props.progress.matsInRange) {
            matsInRange = this.props.progress.matsInRange.join(", ");
            numberOfMatsInRange = this.props.progress.matsInRange.length;
        }

        return (<div className="scan-progress">
            <div className="scan-progress-summary-container">
                <div className="scan-progress-summary-mats">
                    <span className="scan-progress-mats">{matsBranded}</span>
                    <span className="scan-progress-mats-found">&nbsp;Mats Branded</span>
                </div>

            </div>
            <div className="scan-progress-inrange">
                <div>
                    <span className="scan-progress-inrange-mats">{numberOfMatsInRange}</span>
                    <span className="scan-progress-mats-found">&nbsp;Mats In Range</span>
                </div>
                <div className="height-40">
                    <p className="margin-top-10">
                        {matsInRange}
                    </p>
                </div>

                <div className="scan-progress-buttons">

                    <button
                        className="btn btn-green width-300"
                        onClick={() => {
                            ipcRenderer.send("batch:process", { branded: true });
                        }}

                    >
                        Brand
                   </button>

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


export default connect(mapStateToProps, actions)(ScanProgressBranding);