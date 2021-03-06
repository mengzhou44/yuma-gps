import React, { Component } from "react";
import moment from "moment";

import { ipcRenderer } from "electron";
import { Button, Modal } from "semantic-ui-react";

import Error from "../_common/error";

export default class AddNewJob extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            jobName: "",
            error: ""
        };
    }


    isEmpty(text) {
        const trimmed = text.trim();
        return (!trimmed || trimmed.length === 0);
    }

    render() {
        let triggerDisabled = false;
        if (this.props.clientId === "-1") {
            triggerDisabled = true;
        }

        return (
            <Modal
                open={this.state.showModal}
                trigger={
                    <div
                        className="btn add-new-job-button"
                        disabled={triggerDisabled}
                        onClick={() => this.setState({
                            showModal: true,
                            error: "",
                            jobName: ""
                        })}
                    >
                        +
                </div>}
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

                                    if (this.isEmpty(this.state.jobName)) {
                                        this.setState({ error: "Job name is required." });
                                        return;
                                    }
                                    this.setState({ error: "" });

                                    const job = {
                                        jobName: this.state.jobName,
                                        clientId: parseInt(this.props.clientId)
                                    }
                                    ipcRenderer.send("clients:new-job", job);
                                    ipcRenderer.once("clients:new-job", (event, jobId) => {
                                        this.props.onJobAdded();
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
