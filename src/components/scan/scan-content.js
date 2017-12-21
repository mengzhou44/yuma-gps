import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from "../../actions";

class ScanContent extends Component {

    componentDidMount() {
        this.props.getJobTypes();
    }

    render() {
        console.log(this.props.jobTypes);
        return (
            <div>
                Scan Content
            </div>
        );
    }
}

function mapStateToProps({ scan }) {
    return {
        jobTypes: scan.jobTypes
    };
}

export default connect(mapStateToProps, actions)(ScanContent);

