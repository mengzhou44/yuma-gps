import _ from 'lodash';
import * as types from '../actions/types';

const INITIAL_STATE = { jobTypes: [] };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.JOB_TYPES_FETCHED:
            return { jobTypes: action.payload };
        default:
            return state;
    }
}
