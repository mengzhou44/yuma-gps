import React, { Component } from "react";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";
import { Button, Modal } from "semantic-ui-react";

import * as actions from "../../actions";

import Error from "../_common/error";

class AddNewJob extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            jobName: "",
            error: ""
        };
    }

    render() {
        let triggerDisabled = false;
        if (this.props.clientId === -1) {
            triggerDisabled = true;
        }

        return (
            <Modal
                open={this.state.showModal}
                trigger={
                    <a
                        className="waves-effect waves-light  btn btn-orange width-50"
                        disabled={triggerDisabled}
                        onClick={() => this.setState({
                            showModal: true,
                            error: "",
                            jobName: ""
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
                                value={this.state.jobName}
                                placeholder="New Job Name"
                                onChange={e => this.setState({ jobName: e.target.value })}
                            />
                            <button
                                className="btn btn-orange width-120 pull-right"
                                onClick={() => {
                                    this.setState({
                                        error: ""
                                    });

                                    const job = {
                                        jobName: this.state.jobName,
                                        clientId: this.props.clientId
                                    }
                                    ipcRenderer.send("clients:new-job", job);
                                    ipcRenderer.once("clients:new-job", (event, jobId) => {
                                        this.props.getClients(() => {
                                            this.props.resetScanStatus();
                                            this.props.onJobAdded();
                                        });
                                    });

                                    this.setState({
                                        showModal: false
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

function mapStateToProps({ scan }) {
    return {
        clientId: scan.clientId
    };
}

export default connect(mapStateToProps, actions)(AddNewJob);