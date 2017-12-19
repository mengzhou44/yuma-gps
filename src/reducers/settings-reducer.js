import _ from 'lodash';
import * as types from '../actions/types';

const INITIAL_STATE = { data: {} };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.SETTINGS_FETCHED:
            return { data: action.payload };
        default:
            return state;
    }
}
