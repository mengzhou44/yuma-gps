import _ from 'lodash';
import * as types from '../actions/types';

const INITIAL_STATE = { status: 'checking', result: {} };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.DEVICES_STATUS_FETCHED:
            return { status: action.payload.status, result: action.payload.result };
        case types.DEVICES_CHECK_COMPLETED:
            return { ...state, status: 'check-completed' };
        default:
            return state;
    }
}
