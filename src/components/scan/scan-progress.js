import React, { Component } from "react";

import ScanProgressScan from "./scan-progress-scan";
import ScanProgressContamination from "./scan-progress-contamination";

export default class ScanProgress extends Component {

    render() {

        return (<div>
            <ScanProgressScan />
            <ScanProgressContamination />
        </div>);
    }
}


