import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import CheckDevicesReducer from "./check-devices-reducer";
import CheckPortalReducer from "./check-portal-reducer";
import GPSReducer from "./gps-reducer";
import ScanReducer from "./scan-reducer";
import SyncReducer from "./sync-reducer";

import SettingsReducer from "./settings-reducer";

export default combineReducers({
    form: formReducer,
    checkDevices: CheckDevicesReducer,
    checkPortal: CheckPortalReducer,
    scan: ScanReducer,
    sync: SyncReducer,
    gps: GPSReducer,
    settings: SettingsReducer
});
