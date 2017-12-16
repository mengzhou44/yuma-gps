import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Error from '../components/error';

class ScanScreen extends Component {

    renderWifiStatus() {
      if (this.props.wifi.available) {
          return  "Available";
      }

      return "Not Available";

    }


    render() {
        console.log(this.props.wifi);
        return (
            <div className='align-center'>
            <h3>YUMA GPS</h3>

            <button  className='btn btn-orange'  onClick={()=> this.props.getGPSLocation()}>
                 Get Location
            </button> 
             <div> Latitude: {this.props.location.latitude }
           </div>
            <div> Longitude: {this.props.location.longitude }
           </div>

            <hr/> 
            <button  className='btn btn-orange'  onClick={()=> this.props.checkWifi()}>
                Check Wifi
            </button> 
             <div> Status:  {this.renderWifiStatus()}
           </div>
         

        </div>);
    }
}

function mapStateToProps({ gps }) {
    return {
         location: gps.location,
         wifi: gps.wifi
    };
}

export default connect(mapStateToProps, actions)(ScanScreen);

