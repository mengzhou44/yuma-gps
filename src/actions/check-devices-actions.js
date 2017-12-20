import { ipcRenderer } from 'electron';
import * as types from './types';


export function checkDevices() {
    return function (dispatch) {
        ipcRenderer.send("devices:check");
        ipcRenderer.on("devices:status", (event, result) => {
            const payload = {
                result
            };
            if (result["gps"] && result["wifi"] && result["reader"]) {
                payload.status = "check-passed";
            }
            else {
                payload.status = "check-fail";
            }
            dispatch({ type: types.DEVICES_STATUS_FETCHED, payload });
        });
    };
}


export function completeCheckDevices() {
    return { type: types.DEVICES_CHECK_COMPLETED }
}