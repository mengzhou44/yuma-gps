import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import GPSReducer from './gps-reducer';
import DevicesReducer from './devices-reducer';
import SettingsReducer from './settings-reducer';

export default combineReducers({
    form: formReducer,
    gps: GPSReducer,
    devices: DevicesReducer,
    settings: SettingsReducer
});
