import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Error from '../components/error';

class ScanScreen extends Component {

 
    render() {
        console.log(this.props.location);
        return (
            <div className='align-center'>
            <h3>YUMA GPS</h3>

            <button  className='btn btn-orange'  onClick={()=> this.props. getGPSLocation()}>
                 Get Location
            </button> 
             <div> Latitude: {this.props.location.latitude }
           </div>
            <div> Longitude: {this.props.location.longitude }
           </div>
        </div>);
    }
}

function mapStateToProps({ gps }) {
    return {
         location: gps.location
    };
}

export default connect(mapStateToProps, actions)(ScanScreen);

