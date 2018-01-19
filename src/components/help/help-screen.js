import React, { Component } from "react";
import Header from "../_common/header";
import HelpFaq from "./help-faq";
import HelpContact from "./help-contact";


export default class HelpScreen extends Component {

    constructor(props) {
        super(props);
        this.state = { current: "faq" };
    }


    getSideBarLinkClass(link) {
        if (this.state.current === link) {
            return "collection-item active-link";
        }
        return "collection-item";
    }

    renderSideBar() {
        return (
            <ul className="collection sidebar">
                <li
                    className={this.getSideBarLinkClass("faq")}
                    onClick={() => this.setState({ current: "faq" })}
                >
                    Faq
                </li>
                <li
                    className={this.getSideBarLinkClass("contact")}
                    onClick={() => this.setState({ current: "contact" })}
                >
                    Contact
                </li>

            </ul>
        );
    }


    render() {

        return (
            <div>
                <Header />
                <div className="row">
                    <div className="col s12 m3">{this.renderSideBar()}</div>
                    <div className="col s12 m9">
                        <HelpFaq current={this.state.current} />
                        <HelpContact current={this.state.current} />

                    </div>
                </div>
            </div>);

    }
}



