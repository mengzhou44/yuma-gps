import _ from "lodash";
import * as types from "../actions/types";

const INITIAL_STATE = {
    clients: [],
    clientId: -1,
    jobId: -1,
    jobType: "",
    created: null,
    status: "not-started",
    progress: {}
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.SCAN_STATUS_RESET:
            return { ...INITIAL_STATE };
        case types.SCAN_STARTED:
            const { clients, created, clientId, jobId, jobType } = action.payload;
            return { ...state, status: "started", clients, created, clientId, jobId, jobType };
        case types.SCAN_FINISHING:
            return { ...state, status: "finishing" };
        case types.MAT_FOUND:
            return { ...state, progress: action.payload };
        default:
            return state;
    }
}
