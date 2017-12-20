import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';

import * as actions from '../../actions';
import Error from '../_common/error';
import Header from '../_common/header';

import CheckDevices from './check-devices';


class ScanScreen extends Component {

    componentDidMount() {
        ipcRenderer.send("system:initialized");
    }

    renderScanContent() {
        if (this.props.checkDevicesStatus === "check-completed") {
            return (<div>
                <h1> Show Scan Content Here!  </h1>
            </div>)
        }
    }


    render() {
        return (
            <div>
                <Header />
                <CheckDevices />
                {this.renderScanContent()}
            </div>);
    }
}

function mapStateToProps(state) {
    return {

        checkDevicesStatus: state.checkDevices.status
    };
}

export default connect(mapStateToProps, actions)(ScanScreen);

