import React, { Component } from "react";

import { ipcRenderer } from "electron";
import { Button, Modal } from "semantic-ui-react";

import Error from "../_common/error";

export default class AddNewClient extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            clientName: "",
            error: ""
        };
    }

    isEmpty(text) {
        const trimmed = text.trim();
        return (!trimmed || trimmed.length === 0);
    }

    render() {
        return (
            <Modal
                open={this.state.showModal}
                trigger={
                    <button
                        className="btn add-new-client-button"
                        onClick={() => this.setState({
                            showModal: true,
                            error: "",
                            clientName: ""
                        })}
                    >
                        <div className="add-new-client-button-icon">
                            +
                        </div>

                    </button>}
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
                                className="btn btn-orange pull-right rounded"
                                onClick={() => {
                                    if (this.isEmpty(this.state.clientName)) {
                                        this.setState({
                                            error: "Client name is required"
                                        });
                                        return;
                                    }
                                    this.setState({
                                        error: ""
                                    });

                                    ipcRenderer.send("clients:new-client", this.state.clientName);
                                    ipcRenderer.once("clients:new-client", (event, clientId) => {
                                        this.props.onClientAdded();
                                        this.setState({
                                            showModal: false
                                        });

                                    });
                                }}
                            >
                                Add
                        </button>
                            <button
                                className="btn btn-red pull-right margin-right-20 rounded width-120"
                                onClick={() =>
                                    this.setState({ showModal: false })
                                }
                            >
                                Cancel
                        </button>
                            <Error message={this.state.error} />
                        </div>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        );
    }
}

