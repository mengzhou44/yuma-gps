import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import _ from "lodash";

import MyTransition from "../_common/my-transition";
import * as actions from "../../actions";
import MyConfirm from '../_common/my-confirm';
import ScanProgress from './scan-progress';

class ScanStop extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showConfirm: false, confirmMessage: '', onCancel: () => {
                this.setState({
                    showConfirm: false
                });
            }
        };
    }

    renderButtons() {
        if (this.props.status === "started") {
            return (
                <button
                    className="btn btn-block btn-green"
                    onClick={() => this.props.stopScan()}
                >
                    Stop
                </button>
            );
        }

        return (
            <div>
                <button
                    className="btn btn-block btn-green"
                    onClick={() => this.props.resumeScan()}
                >
                    Resume
            </button>

                <div className="height-30" />
                <button
                    className="btn btn-block btn-orange"
                    onClick={() => {
                        this.setState({
                            showConfirm: true,
                            confirmMessage: "Are you sure you want to finish this scan?",
                            onConfirm: () => {
                                const { clientId, jobId, created } = this.props;
                                this.props.finishScan(
                                    {
                                        clientId: parseInt(clientId),
                                        jobId: parseInt(jobId),
                                        created
                                    }
                                );
                            }
                        })
                    }}
                >
                    Finish
            </button>

            </div>
        );


    }

    renderSelected() {

        if (this.props.status !== "not-started") {
            const client = _.find(this.props.clients, (client) => client.clientId === this.props.clientId);
            const job = _.find(client.jobs, (job) => job.id === this.props.jobId);
            return (

                <div className="scan-stop-summary">
                    <div><h4>{client.clientName}</h4></div>
                    <div>{job.name} </div>
                </div>
            );
        }
    }

    render() {
        const visible = this.props.status !== "not-started";


        return (
            <MyTransition visible={visible}>
                <div>
                    {this.renderSelected()}
                    <ScanProgress />
                    <div className="scan-stop-buttons">
                        {this.renderButtons()}
                    </div>
                    <MyConfirm
                        showConfirm={this.state.showConfirm}
                        message={this.state.confirmMessage}
                        onCancel={this.state.onCancel}
                        onConfirm={this.state.onConfirm}
                        cancelButtonText="No"
                        confirmButtonText="Yes"
                    />
                </div>
            </MyTransition>
        );
    }
}

function mapStateToProps({ scan }) {
    return {
        clients: scan.clients,
        clientId: scan.clientId,
        jobId: scan.jobId,
        created: scan.created,
        status: scan.status,
        progress: scan.progress,
    }
}


export default connect(mapStateToProps, actions)(withRouter(ScanStop));

