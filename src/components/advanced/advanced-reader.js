import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { Divider } from "semantic-ui-react";
import { connect } from "react-redux";
import MyTransition from "../_common/my-transition";
import { renderField } from "../_common/render-field";
import * as actions from "../../actions";

class AdvancedReader extends Component {

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

        const visible = this.props.current === "reader";

        return (
            <MyTransition visible={visible}>
                <div className="sidebar-content">
                    <h5 className="color-orange">Reader</h5>
                    <Divider />

                    <form
                        className="settings-form"
                        onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))}
                    >

                        <Field
                            name="host"
                            label="HOST"
                            component={renderField}
                            type="text"
                            disabled={this.state.disabled}
                        />

                        <Field
                            name="port"
                            label="PORT"
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

    if (!values.host) {
        errors.host = "Please enter HOST address.";
    }

    if (!values.port) {
        errors.port = "Please enter Port number.";
    }

    return errors;
};


function mapStateToProps({ settings }) {
    return {
        initialValues: settings.data.reader
    };
}


export default connect(mapStateToProps, actions)(
    reduxForm({
        form: "reader-form",
        enableReinitialize: true,
        validate
    })(AdvancedReader));

