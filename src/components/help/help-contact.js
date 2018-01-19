import React, { Component } from "react";
import { Divider } from "semantic-ui-react";

import MyTransition from "../_common/my-transition";


export default class HelpContact extends Component {


    render() {

        const visible = this.props.current === "contact";

        return (
            <MyTransition visible={visible}>
                <div className="sidebar-content">
                    <h5 className="color-orange">Contact</h5>
                    <Divider />

                </div>
            </MyTransition>
        );
    }
}
