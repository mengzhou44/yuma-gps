import { combineReducers } from 'redux';
import GPSReducer from './gps-reducer';
import DevicesReducer from './devices-reducer';

export default combineReducers({
    gps: GPSReducer,
    devices: DevicesReducer
});
