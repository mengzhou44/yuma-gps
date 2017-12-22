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

    onSubmit(props) {
        console.log("values", props);
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

    render() {
        let scanButtonDisabled = true;
        if (this.props.jobId !== -1 && this.props.clientId !== -1) {
            scanButtonDisabled = false;
        }
        return (
            <div>
                <form
                    className='scan-form'
                    onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))}
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

                    <div className='height-20' />

                    <Field
                        name='jobId'
                        type="text"
                        placeholder="Please select job ..."
                        options={this.getJobOptions(this.props.clientId)}
                        onSelected={(jobId) => this.props.selectJobId(jobId)}
                        component={renderDropdownField}
                    />

                    <button
                        disabled={scanButtonDisabled}
                        className='btn btn-primary btn-block btn-green margin-top-10'
                    >
                        Scan
                    </button>

                </form>
            </div>
        );
    }
}

function mapStateToProps({ scan }) {
    return {
        clients: scan.clients,
        clientId: scan.clientId,
        jobId: scan.jobId
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


