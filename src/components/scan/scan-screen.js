import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';

import * as actions from '../../actions';
import Error from '../_common/error';
import Header from '../_common/header';

import CheckDevices from './check-devices';
import ScanContent from './scan-content';


class ScanScreen extends Component {

    componentDidMount() {
        ipcRenderer.send("system:initialized");
    }

    renderScanContent() {
        if (this.props.checkDevicesStatus === "check-completed") {
            return <ScanContent />
        }
    }


    render() {
        return (
            <div>
                <Header />
                <div className="screen-content">
                    <CheckDevices />
                    {this.renderScanContent()}
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

