import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import CheckDevicesReducer from './check-devices-reducer';
import GPSReducer from './gps-reducer';
import ScanReducer from './scan-reducer';

import SettingsReducer from './settings-reducer';

export default combineReducers({
    form: formReducer,
    checkDevices: CheckDevicesReducer,
    scan: ScanReducer,
    gps: GPSReducer,
    settings: SettingsReducer
});
