import _ from 'lodash';
import * as types from '../actions/types';

const INITIAL_STATE = { status: 'checking', result: {} };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.DEVICES_STATUS_RESET:
            return { ...INITIAL_STATE };
        case types.DEVICES_STATUS_FETCHED:
            return { status: action.payload.status, result: action.payload.result };
        default:
            return state;
    }
}
