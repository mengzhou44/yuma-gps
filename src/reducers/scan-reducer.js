import _ from "lodash";
import * as types from "../actions/types";

const INITIAL_STATE = {
    clients: [],
    clientId: -1,
    jobId: -1,
    created: null,
    contaminationJob: false,
    status: "not-started",
    progress: {}
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.SCAN_STATUS_RESET:
            return { ...INITIAL_STATE };
        case types.SCAN_STARTED:
            const { clients, created, clientId, jobId, contaminationJob } = action.payload;
            return { ...state, status: "started", clients, created, clientId, jobId };
        case types.SCAN_RESUMED:
            return { ...state, status: "started" };
        case types.SCAN_STOPPED:
            return { ...state, status: "stopped" };
        case types.MAT_FOUND:
            return { ...state, progress: action.payload };
        default:
            return state;
    }
}
