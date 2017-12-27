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
                            showModal: true,
                            error: "",
                            clientName: ""
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
                                className="btn btn-orange pull-right rounded width-120"
                                onClick={() => {
                                    this.setState({
                                        error: ""
                                    });

                                    ipcRenderer.send("clients:new-client", this.state.clientName);
                                    ipcRenderer.once("clients:new-client", (event, clientId) => {

                                        this.props.getClients(() => {
                                            this.props.resetScanStatus();
                                            this.props.onClientAdded();

                                        });

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

export default connect(null, actions)(AddNewClient);