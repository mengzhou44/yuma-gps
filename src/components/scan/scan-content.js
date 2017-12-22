import React, { Component } from 'react';

import ScanStart from './scan-start';
import ScanStop from './scan-stop';

class ScanContent extends Component {
    render() {
        return (
            <div>
                <ScanStart />
                <div className='height-20' />
                <ScanStop />
            </div>
        );
    }
}

export default ScanContent;

