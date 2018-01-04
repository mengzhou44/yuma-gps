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

    isNormalInteger(str) {
        var n = Math.floor(Number(str));
        return String(n) === str && n >= 0;
    }

    validateJobName(jobName) {
        const year = moment().format("YY");
        const monthday = moment().format("MMDD");
        const temp = jobName.split("-");

        if (temp.length !== 4) {
            return false;
        }
        if (temp[0] !== year) {
            return false;
        }
        if (temp[3] !== monthday) {
            return false;
        }

        if (!this.isNormalInteger(temp[1])) {
            return false;
        }

        if (temp[2] !== "01" &&
            temp[2] !== "02" &&
            temp[2] !== "03" &&
            temp[2] !== "04" &&
            temp[2] !== "05" &&
            temp[2] !== "06") {
            return false;
        }

        return true;
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
                                    const valid = this.validateJobName(this.state.jobName);
                                    if (valid === false) {
                                        this.setState({ error: "Job name is invalid." });
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