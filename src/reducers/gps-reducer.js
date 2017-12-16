import _ from 'lodash';
import * as types from '../actions/types';

const INITIAL_STATE = { location:'', wifi: { available: false }};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.LOCATION_FETCHED:
            return { ...state, location: action.payload };
       case types.WIFI_STATUS_FETCHED:
            return { ...state, wifi: action.payload };
        default:
            return state;
    }
}
