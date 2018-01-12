import React, { Component } from "react";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";
import  Error from "../_common/error";

import * as actions from "../../actions";

class ScanProgress extends Component {

    render() {

        const  {error } = this.props.progress;

        if  (error) {
          
            return (
                <Error message={error}   />
            );
        }

        let mats = 0;
        let matsInRange = 0;
        if (this.props.progress.found) {
            mats = this.props.progress.found;
        }

        if (this.props.progress.inRange) {
            matsInRange = this.props.progress.inRange;
        }
        return (<div className="scan-progress">
            <div className="scan-progress-mats-container">
                <span className="scan-progress-mats">{mats}</span>
                <span className="scan-progress-mats-found">&nbsp;Mats Found</span>
            </div>
            <div className="scan-progress-inrange">
                <div>
                    <span className="scan-progress-inrange-mats">{matsInRange}</span>
                    <span className="scan-progress-mats-found">&nbsp;Mats In Range</span>
                </div>
                <div className="scan-progress-buttons">
                    <div className="margin-20">
                        <button
                            className="btn btn-green"
                            onClick={() => {
                                ipcRenderer.send("batch:process", { contaminated: false });
                            }}

                        >
                            Decontaminated
                   </button>
                    </div>
                    <div className="margin-20">
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
        progress: scan.progress
    }
}


export default connect(mapStateToProps, actions)(ScanProgress);