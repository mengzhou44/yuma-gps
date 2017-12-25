import React, { Component } from 'react';
import { Confirm } from 'semantic-ui-react';


export default class MyConfirm extends Component {
    render() {
        const cancelButtonText = this.props.cancelButtonText || 'Cancel';
        const confirmButtonText = this.props.confirmButtonText || 'Ok';

        return (
            <Confirm
                open={this.props.showConfirm}
                content={this.props.message}
                cancelButton={cancelButtonText}
                confirmButton={confirmButtonText}
                onCancel={() => this.props.onCancel()}
                onConfirm={() => {
                    this.props.onConfirm();
                    this.props.onCancel();
                }}
            />
        );
    }
}

