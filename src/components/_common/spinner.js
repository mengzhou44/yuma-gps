import React, { Component } from 'react';

import { connect } from 'react-redux';

class Spinner extends Component {
    render() {
        if (this.props.visible) {
            if (this.props.message) {
                return (
                    <div className='spinner-text'>
                        {this.props.message}
                    </div>
                );
            }
            return (
                <div className='spinner' />
            );
        }

        return <div />;
    }
}

function mapStateToProps(state) {
    return {
        visible: state.spinner.visible
    };
}

export default connect(mapStateToProps)(Spinner);
