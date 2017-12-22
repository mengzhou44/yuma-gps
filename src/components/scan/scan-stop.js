import React, { Component } from 'react';
import { connect } from "react-redux";
import _ from "lodash";


import * as actions from "../../actions";

class ScanStop extends Component {

    render() {
        return (
            <div> Scan Stop </div>
        );
    }
}


export default connect(null, actions)(ScanStop);

