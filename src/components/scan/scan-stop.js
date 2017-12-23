import React, { Component } from 'react';
import { connect } from "react-redux";
import _ from "lodash";
import * as actions from "../../actions";

class ScanStop extends Component {

    renderButtons() {
        if (this.props.status === "started") {
            return (
                <button
                    className='btn btn-block btn-green'
                    onClick={() => this.props.stopScan()}
                >
                    Stop
                </button>
            );
        }

        return (
            <div>
                <button
                    className='btn btn-block btn-green'
                >
                    Continue
            </button>
                <div className="height-30" />
                <button
                    className='btn btn-block btn-red'
                >
                    Abort
            </button>
                <div className="height-30" />
                <button
                    className='btn btn-block btn-orange'
                >
                    Finish
            </button>

            </div>
        );


    }
    render() {
        if (this.props.status === "not-started") {
            return <span />;
        }

        return (
            <div>

                <div className="height-30" />

                <div className='align-center'>
                    <span className='scan-stop-mats'>{this.props.mats}</span>
                    <span className='scan-stop-mats-found'> Mats Found</span>
                </div>

                <div className="height-30" />

                {this.renderButtons()}
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

