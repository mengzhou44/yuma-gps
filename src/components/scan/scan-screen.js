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

    renderContent() {
        if (this.props.checkDevicesStatus === "check-completed") {
            return <ScanContent />
        } else {
            return <div className="margin-top-100">
                <CheckDevices />
            </div>
        }
    }


    render() {
        return (
            <div className='screen'>
                <Header />
                <div className="screen-content-container">
                    <div className="screen-content">
                        {this.renderContent()}
                    </div>
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

