import React, { Component } from 'react';
import { connect } from "react-redux";
import _ from "lodash";
import Select from 'react-select';


import * as actions from "../../actions";

class ScanContent extends Component {

    constructor(props) {
        super(props);
        this.state = { selectedOption: "" };
    }
    componentDidMount() {

    }

    handleChange = (selectedOption) => {
        this.setState({ selectedOption });
        console.log(`Selected: ${selectedOption.label}`);
    }

    render() {

        return (
            <div>

                <Select
                    placeholder="Please select job type..."
                    clearable={false}
                    multi={false}
                    value={this.state.selectedOption}
                    onChange={this.handleChange}
                    options={[
                        { value: 'one', label: 'One' },
                        { value: 'two', label: 'Two' },
                    ]}
                />

            </div>
        );
    }
}

function mapStateToProps({ scan }) {
    return {
        jobTypes: scan.jobTypes
    };
}

export default connect(mapStateToProps, actions)(ScanContent);

