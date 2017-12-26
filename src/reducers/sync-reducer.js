import _ from 'lodash';
import * as types from '../actions/types';

const INITIAL_STATE = { scans: [] };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.SYNC_SCANS_FETCHED:
            return { scans: action.payload };
        default:
            return state;
    }
}
