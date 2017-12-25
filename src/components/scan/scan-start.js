import React, { Component } from 'react';
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import _ from "lodash";

import { renderDropdownField } from "../_common/render-field";

import * as actions from "../../actions";

class ScanStart extends Component {

    componentDidMount() {
        this.props.getClients();
    }

    getClientOptions() {
        const options = [];
        _.map(this.props.clients, client => {
            const key = client.clientId;
            options.push({ value: client.clientId, key, text: client.clientName });
        });

        return _.sortBy(options, 'text');
    }

    getJobOptions() {
        if (this.props.clientId === -1) return [];
        const client = _.find(this.props.clients, (client) => client.clientId === this.props.clientId);
        const options = [];
        _.map(client.jobs, job => {
            const key = job.id;
            options.push({ value: job.id, key, text: job.name });
        });

        return _.sortBy(options, 'text');
    }

    renderForm() {

        if (this.props.status === "not-started") {

            let scanButtonDisabled = true;
            if (this.props.jobId !== -1 && this.props.clientId !== -1) {
                scanButtonDisabled = false;
            }

            return (

                <form
                    className='margin-top-100'
                >
                    <Field
                        name='clientId'
                        type="text"
                        placeholder="Please select client ..."
                        options={this.getClientOptions()}
                        onSelected={(clientId) => {
                            this.props.selectClientId(clientId);
                            this.props.selectJobId(-1);
                        }}
                        component={renderDropdownField}
                    />

                    <div className='height-50' />

                    <Field
                        name='jobId'
                        type="text"
                        placeholder="Please select job ..."
                        options={this.getJobOptions(this.props.clientId)}
                        onSelected={(jobId) => this.props.selectJobId(jobId)}
                        component={renderDropdownField}
                    />

                    <div className='height-50' />

                    <button
                        disabled={scanButtonDisabled}
                        className='btn btn-primary btn-block btn-green margin-top-10'
                        onClick={() => this.props.startScan(this.props.mats)}
                    >
                        Scan
                 </button>

                </form>
            );
        }
    }

    renderSelected() {

        if (this.props.status !== "not-started") {
            const client = _.find(this.props.clients, (client) => client.clientId === this.props.clientId);
            const job = _.find(client.jobs, (job) => job.id === this.props.jobId);
            return (

                <div className="scan-start-summary">
                    <div><h4>{client.clientName}</h4></div>
                    <div>{job.name} </div>
                </div>
            );
        }
    }

    render() {

        return (
            <div>
                {this.renderForm()}
                {this.renderSelected()}
            </div>
        );
    }
}

function mapStateToProps({ scan }) {
    return {
        clients: scan.clients,
        clientId: scan.clientId,
        jobId: scan.jobId,
        status: scan.status,
        mats: scan.mats
    };
}

const validate = (values) => {
    const errors = {};

    return errors;
}

export default connect(mapStateToProps, actions)(reduxForm({
    form: 'scan-form',
    enableReinitialize: true,
    validate
})(ScanStart));


