import React, { Component } from 'react';
import { connect } from "react-redux";
import _ from "lodash";
import * as actions from "../../actions";

class ScanStop extends Component {

    renderButtons() {
        return (
            <button
                className='btn btn-block btn-red'
                onClick={() => this.props.stopScan()}
            >
                Stop
            </button>
        );
    }
    render() {
        if (this.props.status === "not-started") {
            return <span />;
        }

        return (
            <div>
                {this.renderButtons()}
                <div className="height-20" />
                <h4>Mats </h4>
                <div>
                    <span className='scan-stop-mats'> {this.props.mats} </span>  Found
                </div>
            </div>
        );
    }
}

function mapStateToProps({ scan }) {
    return {
        status: scan.status,
        mats: scan.mats
    }
}


export default connect(mapStateToProps, actions)(ScanStop);

