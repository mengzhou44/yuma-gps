import React, { Component } from "react";
import { connect } from "react-redux";
import { Divider } from "semantic-ui-react";

class AdvancedTablet extends Component {
    render() {
        return <div className="sidebar-content">
            <h5 className="color-orange">Tablet</h5>
            <Divider />

        </div>;
    }
}

function mapStateToProps(state) {

}

export default AdvancedTablet;