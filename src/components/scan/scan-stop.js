import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import _ from "lodash";
import * as actions from "../../actions";
import MyConfirm from '../_common/my-confirm';

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
                    onClick={() => this.props.resumeScan(this.props.mats)}
                >
                    Resume
            </button>
                <div className="height-30" />
                <button
                    className="btn btn-block btn-red"
                    onClick={() => {
                        this.setState({
                            showConfirm: true,
                            confirmMessage: "Are you sure you want to abort this scan?",
                            onConfirm: () => {
                                this.props.abortScan();
                            }
                        })
                    }}
                >
                    Abort
            </button>
                <div className="height-30" />
                <button
                    className="btn btn-block btn-blue"
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
        if (this.props.status === "not-started") {
            return <span />;
        }

        return (
            <div>
                {this.renderSelected()}
                <div className="height-30" />

                <div className="align-center">
                    <span className="scan-stop-mats">{this.props.mats}</span>
                    <span className="scan-stop-mats-found">&nbsp;Mats Found</span>
                </div>
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
        mats: scan.mats,
    }
}


export default connect(mapStateToProps, actions)(withRouter(ScanStop));

