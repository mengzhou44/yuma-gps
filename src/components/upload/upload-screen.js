import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';

import * as actions from '../../actions';
import Error from '../_common/error';
import Header from '../_common/header';


class UploadScreen extends Component {

    render() {
        return (
            <div>
                <Header />
                <h3>Upload Screen </h3>
            </div>);
    }
}



export default connect(null, actions)(UploadScreen);

