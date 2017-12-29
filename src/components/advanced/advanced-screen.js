import React, { Component } from "react";
import Header from "../_common/header";
import AdvancedTablet from "./advanced-tablet";
import AdvancedReader from "./advanced-reader";


export default class AdvancedScreen extends Component {

    constructor(props) {
        super(props);
        this.state = { current: "tablet" };
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
                    className={this.getSideBarLinkClass("tablet")}
                    onClick={() => this.setState({ current: "tablet" })}
                >
                    Tablet
                </li>
                <li
                    className={this.getSideBarLinkClass("reader")}
                    onClick={() => this.setState({ current: "reader" })}
                >
                    Reader
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
                        <AdvancedTablet current={this.state.current} />
                        <AdvancedReader current={this.state.current} />
                    </div>
                </div>
            </div>);

    }
}



