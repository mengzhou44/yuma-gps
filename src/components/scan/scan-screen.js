import React, { Component } from "react";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";

import * as actions from "../../actions";
import Error from "../_common/error";
import Header from "../_common/header";


import CheckDevices from "./check-devices";
import ScanStart from './scan-start';
import ScanStop from './scan-stop';



class ScanScreen extends Component {

    componentDidMount() {
        console.log("send system:initialized");
        ipcRenderer.send("system:initialized");
    }

    componentWillUnmount() {
        this.props.resetCheckDevicesStatus();
    }

    renderContent() {
        if (this.props.checkDevicesStatus === "check-passed") {
            return (<div>
                <ScanStart />
                <div className='height-20' />
                <ScanStop className="scan-stop" />
            </div>);

        } else {
            return <div className="margin-top-100">
                <CheckDevices />
            </div>
        }
    }

    render() {
        return (
            <div className="screen">
                <Header />

                <div className="screen-content">
                    {this.renderContent()}
                </div>

            </div>);
    }
}

function mapStateToProps(state) {
    return {
        checkDevicesStatus: state.checkDevices.status
    };
}

export default connect(mapStateToProps, actions)(ScanScreen);

