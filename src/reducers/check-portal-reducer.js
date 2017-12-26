import _ from "lodash";
import * as types from "../actions/types";

const INITIAL_STATE = { status: "checking", available: false };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.PORTAL_STATUS_RESET:
            return { ...INITIAL_STATE };
        case types.PORTAL_STATUS_FETCHED:
            return { status: "completed", available: action.payload };
        default:
            return state;
    }
}
