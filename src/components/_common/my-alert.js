import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Header, Modal } from 'semantic-ui-react';

class MyAlert extends Component {

    render() {
        return (
            <Modal
                open={this.props.showAlert}
                size='tiny'
            >
                <Modal.Content >
                    <div className="align-center">
                        <p className="font-size-20">{this.props.message}</p>
                    </div>
                </Modal.Content>
                <Modal.Actions className='my-alert-actions'>
                    <button
                        className="btn btn-green btn-block"
                        onClick={this.props.onClick}
                    >
                        Ok
                     </button>
                </Modal.Actions>
            </Modal>
        );
    }
}


export default MyAlert;
