import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { Divider } from "semantic-ui-react";
import { connect } from "react-redux";
import MyTransition from "../_common/my-transition";
import { renderField } from "../_common/render-field";
import * as actions from "../../actions";

class AdvancedContamination extends Component {

    constructor(props) {
        super(props);
        this.state = { disabled: true };
    }


    componentDidMount() {
        this.props.fetchSettings();
    }

    onSubmit(props) {
        let { settings } = this.props;
        settings.contamination = props;
        this.props.saveSettings(settings, () => {
            this.setState({ disabled: true });
        });
    }

    renderChangeButton() {
        if (this.state.disabled) {
            return <button className="btn btn-green btn-block" onClick={() => this.setState({ disabled: false })}> Change </button>
        }
    }

    renderSaveCancelButtons() {
        if (this.state.disabled) {
            return <span />;
        }

        return (
            <div>
                <button
                    type="submit"
                    className="btn btn-primary btn-block btn-green margin-top-10"
                >
                    Save
                </button>

                <button
                    type="button"
                    className="btn btn-primary btn-block btn-green margin-top-10"
                    onClick={() => {
                        this.props.fetchSettings();
                        this.setState({ disabled: true })
                    }}
                >
                    Cancel
                </button>

            </div>
        );
    }


    render() {

        const visible = this.props.current === "contamination";

        return (
            <MyTransition visible={visible}>
                <div className="sidebar-content">
                    <h5 className="color-orange">Contamination</h5>
                    <Divider />

                    <form
                        className="settings-form"
                        onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))}
                    >

                        <Field
                            name="batchSize"
                            label="Batch Size"
                            component={renderField}
                            type="text"
                            disabled={this.state.disabled}
                        />

                        <Field
                            name="rssiThreshold"
                            label="RSSI Threshold"
                            component={renderField}
                            type="text"
                            disabled={this.state.disabled}
                        />

                        {this.renderChangeButton()}

                        {this.renderSaveCancelButtons()}


                    </form>
                </div>
            </MyTransition>
        );
    }
}

const validate = values => {
    const errors = {};

    if (!values.batchSize) {
        errors.host = "Please enter Batch Size.";
    }

    if (!values.rssiThreshold) {
        errors.port = "Please enter RSSI Threshold.";
    }

    return errors;
};


function mapStateToProps({ settings }) {
    return {
        initialValues: settings.data.contamination,
        settings: settings.data
    };
}


export default connect(mapStateToProps, actions)(
    reduxForm({
        form: "contamination-form",
        enableReinitialize: true,
        validate
    })(AdvancedContamination));

