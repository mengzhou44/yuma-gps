import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Error from '../components/error';

class ScanScreen extends Component {

    renderDevicesStatus() {
        let wifiAvailable = this.props.devicesStatus.wifi ? "Wifi Available" : "Wifi Not Available";

        let gpsAvailable = this.props.devicesStatus.gps ? "GPS Available" : "GPS Not Available";

        return <div>
            <p> {wifiAvailable} </p>
            <p> {gpsAvailable} </p>
        </div>

    }


    render() {
        console.log(this.props.wifi);
        return (
            <div className='align-center'>
                <h3>YUMA GPS</h3>

                <button className='btn btn-orange' onClick={() => this.props.getGPSLocation()}>
                    Get Location
            </button>
                <div> Latitude: {this.props.location.latitude}
                </div>
                <div> Longitude: {this.props.location.longitude}
                </div>

                <hr />
                <button className='btn btn-orange' onClick={() => this.props.checkDevices()}>
                    Check Devices
            </button>
                <div> Devices:  {this.renderDevicesStatus()}
                </div>


            </div>);
    }
}

function mapStateToProps(state) {
    return {
        location: state.gps.location,
        devicesStatus: state.devices.status
    };
}

export default connect(mapStateToProps, actions)(ScanScreen);

