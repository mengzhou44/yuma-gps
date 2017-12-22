import React, { Component } from 'react';
import { connect } from "react-redux";
import _ from "lodash";
import * as actions from "../../actions";

class ScanStop extends Component {

    render() {
        return (
            <div>
                {this.renderButtons()}
                <h4>Mats </h4>
                <div>
                    <span className='scan-stop-mats'> {this.props.mats} </span>  Found
                </div>
            </div>
        );
    }
}

function mapSateToProps({ scan }) {
    return {
        status: scan.status,
        mats: scan.mats
    }
}


export default connect(mapStateToProps, actions)(ScanStop);

