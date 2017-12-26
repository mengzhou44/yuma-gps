import React, { Component } from 'react';

export default class TableRow extends Component {
    render() {
        return (
            <table className="width-100-100">
                <tbody>{this.props.children}</tbody>
            </table>
        );
    }
}
