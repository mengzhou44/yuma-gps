import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';

import * as actions from '../../actions';
import Header from '../_common/header';
import { renderField } from '../_common/render-field';

class SettingsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = { disabled: true };
    }

    componentDidMount() {
        this.props.fetchSettings();

    }

    onSubmit(props) {
        let settings = {};
        settings.reader = props;
        this.props.saveSettings(settings, () => {
            this.setState({ disabled: true });
        });
    }

    renderChangeButton() {
        if (this.state.disabled) {
            return <button className="btn btn-orange" onClick={() => this.setState({ disabled: false })}> Change </button>
        }
    }

    renderSaveCancelButtons() {
        if (this.state.disabled) {
            return <span />;
        }

        return (
            <div>
                <button
                    type='submit'
                    className='btn btn-primary btn-block btn-red margin-top-10'

                >
                    Save
                    </button>

                <button
                    type='button'
                    className='btn btn-primary btn-block btn-red margin-top-10'
                    onClick={() => {
                        this.props.fetchSettings();
                        this.state = { disabled: true };
                    }}
                >
                    Cancel
                    </button>

            </div>
        );
    }


    render() {
        return (
            <div>
                <Header />

                <form
                    className='settings-form'
                    onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))}
                >

                    <Field
                        name='host'
                        label='HOST'
                        component={renderField}
                        type='text'
                        disabled={this.state.disabled}
                    />

                    <Field
                        name='port'
                        label='PORT'
                        component={renderField}
                        type='text'
                        disabled={this.state.disabled}
                    />

                    {this.renderChangeButton()}

                    {this.renderSaveCancelButtons()}


                </form>
            </div>
        );
    }
}
const validate = values => {
    const errors = {};

    if (!values.host) {
        errors.host = 'Please enter HOST address.';
    }

    if (!values.port) {
        errors.port = 'Please enter port number.';
    }

    return errors;
};

function mapStateToProps({ settings }) {
    console.log('reader', settings.data.reader);
    return {
        initialValues: settings.data.reader
    };
}

export default connect(mapStateToProps, actions)(
    reduxForm({
        form: 'settings-form',
        enableReinitialize: true,
        validate
    })(SettingsScreen));

