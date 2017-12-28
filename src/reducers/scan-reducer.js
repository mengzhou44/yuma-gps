import _ from "lodash";
import * as types from "../actions/types";

const INITIAL_STATE = { status: "not-started", clientId: -1, jobId: -1, created: null, mats: 0 };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.SCAN_STATUS_RESET:
            return { ...INITIAL_STATE };
        case types.SCAN_STARTED:
            const { created, clientId, jobId } = action.payload;
            return { ...state, status: "started", created, clientId, jobId };
        case types.SCAN_RESUMED:
            return { ...state, status: "started" };
        case types.SCAN_STOPPED:
            return { ...state, status: "stopped" };
        case types.MAT_FOUND:
            return { ...state, mats: action.payload };
        default:
            return state;
    }
}
