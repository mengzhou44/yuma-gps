import React, { Component } from "react";

import ScanProgressContamination from "./scan-progress-contamination";
import ScanProgressBranding from "./scan-progress-branding";

export default class ScanProgress extends Component {

    render() {

        return (<div>
            <ScanProgressContamination />
            <ScanProgressBranding />
        </div>);
    }
}


