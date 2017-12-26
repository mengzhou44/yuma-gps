import React, { Component } from "react";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";
import { Button, Modal } from "semantic-ui-react";

import * as actions from "../../actions";

import Error from "../_common/error";

class AddNewClient extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            clientName: "",
            error: ""
        };
    }

    render() {
        return (
            <Modal
                open={this.state.showModal}
                trigger={
                    <a
                        className="waves-effect waves-light  btn btn-orange width-50"
                        onClick={() => this.setState({
                            showModal: true
                        })}
                    >
                        <i className="large material-icons">add circle</i> Add
                </a>}
            >
                <Modal.Content>
                    <Modal.Description>
                        <div className="height-100">
                            <input
                                type="text"
                                value={this.state.clientName}
                                placeholder="New Client Name"
                                onChange={e => this.setState({ clientName: e.target.value })}
                            />
                            <button
                                className="btn btn-orange pull-right"
                                onClick={() => {
                                    this.setState({
                                        error: ""
                                    });
                                    console.log("this.state.clientName", this.state.clientName);
                                    ipcRenderer.send("clients:new-client", this.state.clientName);
                                    ipcRenderer.once("clients:new-client", (event, error) => {
                                        if (error) {
                                            this.setState({
                                                error
                                            });
                                        } else {
                                            this.props.getClients();
                                            this.setState({
                                                showModal: false
                                            });
                                        }
                                    });
                                }}
                            >
                                Add
                        </button>
                            <Error message={this.state.error} />
                        </div>
                    </Modal.Description>
                </Modal.Content>
            </Modal>

        );
    }
}

export default connect(null, actions)(AddNewClient);