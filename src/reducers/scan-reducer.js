import _ from 'lodash';
import * as types from '../actions/types';

const INITIAL_STATE = { clients: [], clientId: -1, jobId: -1 };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.CLIENTS_FETCHED:
            return { ...INITIAL_STATE, clients: action.payload };
        case types.CLIENT_ID_SELECTED:
            return { ...state, clientId: action.payload };
        case types.JOB_ID_SELECTED:
            return { ...state, jobId: action.payload };
        default:
            return state;
    }
}
