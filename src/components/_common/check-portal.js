import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class CheckPortal extends Component {

    componentDidMount() {
        this.props.checkPortal();
    }

    render() {

        if (this.props.status === "checking") {
            return (
                <div className="check-portal-checking-container">
                    <div className="check-portal-checking">
                        <div className="check-portal-checking-text"> Checking Portal Access ... </div>
                    </div>
                </div>
            );

        }
        else if (this.props.status === "completed" && this.props.available === false) {

            return (<div className="check-portal-not-available">
                <div className="font-size-20 margin-bottom-20" >
                    Portal is not accessible. Please check internet access.
                 </div>

                <button
                    className="btn btn-red width-400 margin-top-10"
                    onClick={() => {
                        this.props.resetCheckPortalStatus();
                        setTimeout(() => {
                            this.props.checkPortal();
                        }, 1000);

                    }}
                >
                    Try Again
                 </button>
            </div>
            );
        }
        return <span />;
    }
}

function mapStateToProps({ checkPortal }) {
    return {
        status: checkPortal.status,
        available: checkPortal.available
    }
}

export default connect(mapStateToProps, actions)(CheckPortal);