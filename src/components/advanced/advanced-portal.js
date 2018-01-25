import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { Divider } from "semantic-ui-react";
import { connect } from "react-redux";
import MyTransition from "../_common/my-transition";
import { renderField } from "../_common/render-field";
import * as actions from "../../actions";
 

class AdvancedPortal extends Component {

    constructor(props) {
        super(props);
        this.state = { disabled: true };
    }


    componentDidMount() {
        this.props.fetchSettings();
    }

    stripTrailingSlash = (str) => {
        return str.endsWith('/') ?
            str.slice(0, -1) :
            str;
    };


    onSubmit(props) {
        let { settings } = this.props;
        props.url = this.stripTrailingSlash(props.url);
        settings.portal = props;
        console.log("props", props);
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

        const visible = this.props.current === "portal";

        return (
            <MyTransition visible={visible}>
                <div className="sidebar-content">
                    <h5 className="color-orange">Portal</h5>
                    <Divider />

                    <form
                        className="settings-form"
                        onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))}
                    >

                        <Field
                            name="url"
                            label="Address"
                            component={renderField}
                            type="text"
                            disabled={this.state.disabled}
                        />

                        <Field
                            name="upload"  
                            label="Upload"  
                            component={ props => <input type="checkbox" {...props} /> }
                            type="checkbox"   
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

    if (!values.url) {
        errors.host = "Please enter portal address.";
    }

    return errors;
};


function mapStateToProps({ settings }) {
    return {
        initialValues: settings.data.portal,
        settings: settings.data
    };
}


export default connect(mapStateToProps, actions)(
    reduxForm({
        form: "portal-form",
        enableReinitialize: true,
        validate
    })(AdvancedPortal));

