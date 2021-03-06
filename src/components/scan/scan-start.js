import React, { Component } from "react";
import { ipcRenderer } from "electron";
import { connect } from "react-redux";
import Select from "react-select";
import _ from "lodash";

import MyTransition from "../_common/my-transition";
import * as actions from "../../actions";
import TableRow from "../_common/table-row";
import AddNewClient from "./add-new-client";
import AddNewJob from "./add-new-job";

class ScanStart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            clients: [],
            clientId: "-1",
            jobId: "-1"
        }
    }

    getClients() {
        ipcRenderer.send("clients:get");
        ipcRenderer.once("clients:result", (event, data) => {
            _.map(data, client => {
                client.clientId = client.clientId.toString();
                _.map(client.jobs, job => {
                    job.id = job.id.toString();
                })
            });
            this.setState({ clients: data })
        });
    }

    componentDidMount() {
        this.getClients();
    }



    getClientOptions() {
        const options = [];
        _.map(this.state.clients, client => {
            options.push({ value: client.clientId, label: client.clientName });
        });
        return _.sortBy(options, "label");
    }

    getJobOptions() {
        if (this.state.clientId === "-1") return [];
        const client = _.find(this.state.clients, (client) => client.clientId === this.state.clientId);
        const options = [];
        _.map(client.jobs, job => {
            options.push({ value: job.id, label: job.name });
        });

        return _.sortBy(options, "label");
    }

    render() {
        const visible = this.props.status === "not-started";
        let scanButtonDisabled = true;
        if (this.state.jobId !== "-1" && this.state.clientId !== "-1") {
            scanButtonDisabled = false;
        }

        return (
            <MyTransition visible={visible} >
                <div className="margin-top-100">

                    <TableRow>
                        <tr>
                            <td className="width-100-100">
                                <Select

                                    clearable={false}
                                    value={this.state.clientId}
                                    placeholder="Please select client ..."
                                    options={this.getClientOptions()}
                                    onChange={option =>
                                        this.setState({
                                            clientId: option.value,
                                            jobId: "-1"
                                        })}
                                />
                            </td>
                            <td>
                                <AddNewClient onClientAdded={() => {
                                    this.getClients();
                                    this.setState({
                                        clientId: "-1",
                                        jobId: "-1"
                                    });
                                }
                                } />

                            </td>
                        </tr>
                    </TableRow>

                    <div className="height-50" />

                    <TableRow>
                        <tr>
                            <td className="width-100-100">
                                <Select
                                    type="text"
                                    clearable={false}
                                    value={this.state.jobId}
                                    placeholder="Please select job ..."
                                    options={this.getJobOptions(this.state.clientId)}
                                    onChange={option =>
                                        this.setState({
                                            jobId: option.value
                                        })}
                                />
                            </td>
                            <td>
                                <AddNewJob
                                    clientId={this.state.clientId}
                                    onJobAdded={() => {
                                        this.getClients();
                                        this.setState({
                                            clientId: "-1",
                                            jobId: "-1"
                                        });
                                    }
                                    } />
                            </td>
                        </tr>
                    </TableRow>

                    <div className="height-50" />
                    <div className="scan-start-button-container">
                        <button
                            disabled={scanButtonDisabled}
                            className="btn btn-primary btn-block btn-green scan-start-button"
                            onClick={() => {

                                this.props.startScan(
                                    {
                                        clients: this.state.clients,
                                        clientId: this.state.clientId,
                                        jobId: this.state.jobId,
                                    }
                                );

                                this.setState({
                                    clientId: "-1",
                                    jobId: "-1"
                                });
                            }}
                        >
                            Scan
                 </button>
                    </div>
                </div>
            </MyTransition>
        );
    }
}

function mapStateToProps({ scan }) {
    return {
        status: scan.status
    };
}



export default connect(mapStateToProps, actions)(ScanStart);


