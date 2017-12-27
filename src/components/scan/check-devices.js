import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions";

class CheckDevices extends Component {

    componentDidMount() {
        this.props.checkDevices();
    }

    renderCheckResultIcon(device) {
        const passed = this.props.result[device];

        if (passed) {
            return <i className="material-icons">check</i>
        }

        return <i className="material-icons color-red">error</i>
    }

    renderDevicesStatus() {
        return (
            <div className="devices-status-container" >
                <ul className="collection with-header width-400">
                    <li className="collection-header"><h4>Devices</h4></li>
                    <li className="collection-item">
                        Tablet GPS
                        <a href="#!" className="secondary-content">
                            {this.renderCheckResultIcon("gps")}
                        </a>
                    </li>
                    <li className="collection-item">
                        WIFI
                           <a href="#!" className="secondary-content">
                            {this.renderCheckResultIcon("wifi")}
                        </a>
                    </li>
                    <li className="collection-item">
                        RFID Reader
                               <a href="#!" className="secondary-content">
                            {this.renderCheckResultIcon("reader")}
                        </a>
                    </li>
                </ul>
            </div>
        );
    }


    render() {
        if (this.props.status === "checking") {
            return (
                <div className="devices-status-checking-container">
                    <div className="devices-status-checking">
                        <div className="devices-status-checking-text"> Checking Devices ... </div>
                    </div>
                </div>
            );

        }
        else if (this.props.status === "check-fail") {

            return (<div className="align-center">
                {this.renderDevicesStatus()}

                <button
                    className="btn btn-red width-400 margin-top-10"
                    onClick={() => {
                        this.props.resetCheckDevicesStatus();
                        setTimeout(() => {
                            this.props.checkDevices();
                        }, 1000);

                    }}
                >
                    Try Again
                </button>
            </div>
            );
        }
        return <span />;
    }
}

function mapStateToProps({ checkDevices }) {
    return {
        status: checkDevices.status,
        result: checkDevices.result
    }
}

export default connect(mapStateToProps, actions)(CheckDevices);