import React, { Component } from "react";
import { Divider } from "semantic-ui-react";

import MyTransition from "../_common/my-transition";


export default class HelpFaq extends Component {


    render() {

        const visible = this.props.current === "faq";

        return (
            <MyTransition visible={visible}>
                <div className="sidebar-content">
                    <h5 className="color-orange">Faq</h5>
                    <Divider />

                </div>
            </MyTransition>
        );
    }
}
