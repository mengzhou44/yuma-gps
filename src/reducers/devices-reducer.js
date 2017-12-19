import _ from 'lodash';
import * as types from '../actions/types';

const INITIAL_STATE = { status: {} };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.DEVICES_STATUS_FETCHED:
            return { status: action.payload };
        default:
            return state;
    }
}
