
import { ipcRenderer } from 'electron';
import * as types from './types';


export function getGPSLocation() {
    return function (dispatch) {
        ipcRenderer.send("gps-data:get");
        ipcRenderer.on("gps-data:result", (event, location) => {
            dispatch({ type: types.LOCATION_FETCHED, payload: location });
        });
    };
}


export function checkDevices() {
    return function (dispatch) {
        ipcRenderer.send("devices:check");
        ipcRenderer.on("devices:status", (event, result) => {
          
            dispatch({ type: types.DEVICES_STATUS_FETCHED, payload: result });
        });
    };
}
