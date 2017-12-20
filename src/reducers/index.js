import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import CheckDevicesReducer from './check-devices-reducer';
import GPSReducer from './gps-reducer';

import SettingsReducer from './settings-reducer';

export default combineReducers({
    form: formReducer,
    checkDevices: CheckDevicesReducer,
    gps: GPSReducer,
    settings: SettingsReducer
});
