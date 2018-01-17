import React, { Component } from "react";
import { ipcRenderer } from "electron";
import { connect } from "react-redux";
import { Divider } from "semantic-ui-react";

import CheckPortal from "../_common/check-portal";
import MyTransition from "../_common/my-transition";
import Error from "../_common/error";
import * as actions from "../../actions";

class AdvancedTablet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            macAddress: "",
            registered: false,
            error: ""
        };
    }
    componentDidMount() {
        this.props.checkPortal();

        ipcRenderer.send("tablet:mac");
        ipcRenderer.once("tablet:mac", (event, macAddress) => {
            this.setState({ macAddress });
        });
        ipcRenderer.send("settings:get");
        ipcRenderer.once("settings:result", (event, settings) => {
            if (settings.tablet.token) {
                this.setState({ registered: true });
            }
        });
    }

    renderPortalNotAccessible() {
        if (this.props.portalAvailable === false) {
            return <p className="margin-top-10">Portal is NOT accessible</p>;
        }
    }

    renderRegisterContent() {
        if (this.state.registered) {
            return (<div className="advanced-tablet-registered">

                <div className="margin-top-5">Registered&nbsp;&nbsp;</div>
                <i className="material-icons">
                    check circle</i>
            </div>);
        }

        let registerButtonDisabled = false;
        if (this.props.portalAvailable === false) {
            registerButtonDisabled = true;
        }
        return (<div>
            <button
                className="btn btn-block btn-green"
                disabled={registerButtonDisabled}
                onClick={() => {
                    this.setState({ error: "" });
                    ipcRenderer.send("tablet:register", this.state.macAddress);
                    ipcRenderer.once("tablet:register", (event, result) => {

                        if (result.error) {
                            this.setState({ error: result.error });
                        } else {
                            this.setState({ registered: true });
                        }
                    });
                }}
            >
                Register
         </button>
            <Error message={this.state.error} />
            {this.renderPortalNotAccessible()}
        </div>
        );

    }

    render() {

        const visible = this.props.current === "tablet";

        return (
            <MyTransition visible={visible}>
                <div className="sidebar-content">
                    <h5 className="color-orange">Tablet</h5>
                    <Divider />
                    <label>Mac Address</label>
                    <p>{this.state.macAddress}</p>
                    {this.renderRegisterContent()}
                </div>
            </MyTransition>
        );

    }
}

function mapStateToProps({ checkPortal }) {
    return {
        portalAvailable: checkPortal.available
    }
}

export default connect(mapStateToProps, actions)(AdvancedTablet);